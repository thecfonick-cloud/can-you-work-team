const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

const DATA_DIR = path.join(__dirname, 'data');

// Ensure database directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate MongoDB-compatible 24-char hex IDs
function generateId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const machine = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  const pid = Math.floor(Math.random() * 65535).toString(16).padStart(4, '0');
  const counter = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  return timestamp + machine + pid + counter;
}

// Deep utility functions for nested path operations
function getNestedValue(obj, pathStr) {
  if (!obj) return undefined;
  const parts = pathStr.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

function setNestedValue(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined || current[part] === null || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

function incNestedValue(obj, pathStr, increment) {
  const parts = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined || current[part] === null || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  const lastKey = parts[parts.length - 1];
  current[lastKey] = (Number(current[lastKey]) || 0) + Number(increment);
}

// Check if a document matches query conditions
function matchQuery(doc, query) {
  if (!query) return true;
  for (const key of Object.keys(query)) {
    const val = query[key];
    if (key === '$or') {
      if (!Array.isArray(val)) return false;
      if (!val.some(subQuery => matchQuery(doc, subQuery))) return false;
    } else if (key === '$and') {
      if (!Array.isArray(val)) return false;
      if (!val.every(subQuery => matchQuery(doc, subQuery))) return false;
    } else {
      const docVal = getNestedValue(doc, key);
      if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        for (const op of Object.keys(val)) {
          const opVal = val[op];
          if (op === '$in') {
            const list = Array.isArray(opVal) ? opVal : [];
            const docValStr = docVal !== undefined && docVal !== null ? docVal.toString() : '';
            if (!list.some(item => (item !== undefined && item !== null ? item.toString() : '') === docValStr)) return false;
          } else if (op === '$nin') {
            const list = Array.isArray(opVal) ? opVal : [];
            const docValStr = docVal !== undefined && docVal !== null ? docVal.toString() : '';
            if (list.some(item => (item !== undefined && item !== null ? item.toString() : '') === docValStr)) return false;
          } else if (op === '$gt' || op === '$gte' || op === '$lt' || op === '$lte') {
            // Normalize both sides to comparable values
            // If either operand looks like a date, compare as timestamps
            let left = docVal;
            let right = opVal;
            const isDateLike = (v) => {
              if (v instanceof Date) return true;
              if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) {
                return !isNaN(new Date(v).getTime());
              }
              return false;
            };
            if (isDateLike(left) || isDateLike(right)) {
              left = new Date(left).getTime();
              right = new Date(right).getTime();
              if (isNaN(left) || isNaN(right)) return false;
            }
            if (op === '$gt' && !(left > right)) return false;
            if (op === '$gte' && !(left >= right)) return false;
            if (op === '$lt' && !(left < right)) return false;
            if (op === '$lte' && !(left <= right)) return false;
          } else if (op === '$ne') {
            const docValStr = docVal !== undefined && docVal !== null ? docVal.toString() : '';
            const opValStr = opVal !== undefined && opVal !== null ? opVal.toString() : '';
            if (docValStr === opValStr) return false;
          }
        }
      } else {
        const docValStr = docVal !== undefined && docVal !== null ? docVal.toString() : '';
        const valStr = val !== undefined && val !== null ? val.toString() : '';
        if (docValStr !== valStr) return false;
      }
    }
  }
  return true;
}

function isNestedSchema(fieldDef) {
  if (!fieldDef || typeof fieldDef !== 'object' || Array.isArray(fieldDef)) return false;
  if (fieldDef.type) {
    if (typeof fieldDef.type === 'function' || typeof fieldDef.type === 'string') {
      return false;
    }
    if (typeof fieldDef.type === 'object' && !Array.isArray(fieldDef.type)) {
      return true;
    }
  }
  const keys = Object.keys(fieldDef);
  if (keys.length === 0) return false;
  return keys.every(k => fieldDef[k] && typeof fieldDef[k] === 'object' && !Array.isArray(fieldDef[k]));
}

// Parse schema and populate default values
function applyDefaults(data, schemaDef) {
  if (!schemaDef) return data;
  const result = { ...data };
  for (const key of Object.keys(schemaDef)) {
    const fieldDef = schemaDef[key];
    if (result[key] === undefined) {
      if (fieldDef && typeof fieldDef === 'object' && !Array.isArray(fieldDef)) {
        if ('default' in fieldDef) {
          if (typeof fieldDef.default === 'function') {
            result[key] = fieldDef.default();
          } else {
            result[key] = JSON.parse(JSON.stringify(fieldDef.default));
          }
        } else if (isNestedSchema(fieldDef)) {
          const subSchema = fieldDef.type && typeof fieldDef.type === 'object' ? fieldDef.type : fieldDef;
          result[key] = applyDefaults({}, subSchema);
        }
      }
    } else if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key]) && isNestedSchema(fieldDef)) {
      const subSchema = fieldDef.type && typeof fieldDef.type === 'object' ? fieldDef.type : fieldDef;
      result[key] = applyDefaults(result[key], subSchema);
    }
  }
  return result;
}

const registeredModels = {};

// Simple JSON Database I/O
function readData(modelName) {
  const filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf8');
    return [];
  }
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(text || '[]');
  } catch (e) {
    console.error(`Error reading database file for ${modelName}:`, e);
    return [];
  }
}

function writeData(modelName, data) {
  const filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error(`Error writing database file for ${modelName}:`, e);
  }
}

// Representing a single Document instance
class Document {
  constructor(data, modelName) {
    Object.assign(this, JSON.parse(JSON.stringify(data)));
    Object.defineProperty(this, '_modelName', { value: modelName, enumerable: false });
  }

  async save() {
    // Run pre-save hooks if registered in the schema
    const schema = registeredModels[this._modelName]?.schema;
    if (schema && schema._preHooks && schema._preHooks['save']) {
      const hooks = schema._preHooks['save'];
      for (const hook of hooks) {
        await new Promise((resolve, reject) => {
          hook.call(this, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }

    const currentData = readData(this._modelName);
    const idStr = this._id ? this._id.toString() : '';
    const idx = currentData.findIndex(d => (d._id ? d._id.toString() : '') === idStr);

    const raw = this.toObject();
    if (idx !== -1) {
      currentData[idx] = raw;
    } else {
      if (!raw._id) {
        raw._id = generateId();
      }
      this._id = raw._id;
      currentData.push(raw);
    }

    writeData(this._modelName, currentData);
    return this;
  }

  toObject() {
    const raw = {};
    for (const key of Object.keys(this)) {
      raw[key] = JSON.parse(JSON.stringify(this[key]));
    }
    return raw;
  }

  toJSON() {
    return this.toObject();
  }
}

// Query runner chain supporting populate, sort, limit, distinct, count
class MockQuery {
  constructor(modelName, query = {}, singleResult = false) {
    this.modelName = modelName;
    this.query = query;
    this.singleResult = singleResult;
    this._populatePaths = [];
    this._selectFields = null;
    this._sortOption = null;
    this._limitVal = null;
    this._countOnly = false;
    this._distinctField = null;
  }

  populate(pathStr, select) {
    this._populatePaths.push({ path: pathStr, select });
    return this;
  }

  select(fields) {
    this._selectFields = fields;
    return this;
  }

  sort(sortOption) {
    this._sortOption = sortOption;
    return this;
  }

  limit(limitVal) {
    this._limitVal = limitVal;
    return this;
  }

  distinct(field) {
    this._distinctField = field;
    return this;
  }

  countDocuments() {
    this._countOnly = true;
    return this;
  }

  async exec() {
    const data = readData(this.modelName);
    let results = data.filter(doc => matchQuery(doc, this.query));

    if (this._countOnly) {
      return results.length;
    }

    if (this._distinctField) {
      const distinctVals = new Set();
      for (const doc of results) {
        const val = getNestedValue(doc, this._distinctField);
        if (val !== undefined && val !== null) {
          distinctVals.add(val.toString());
        }
      }
      return Array.from(distinctVals);
    }

    if (this._sortOption) {
      let sortKey = '';
      let sortOrder = 1;
      if (typeof this._sortOption === 'string') {
        if (this._sortOption.startsWith('-')) {
          sortKey = this._sortOption.substring(1);
          sortOrder = -1;
        } else {
          sortKey = this._sortOption;
          sortOrder = 1;
        }
      } else if (typeof this._sortOption === 'object') {
        sortKey = Object.keys(this._sortOption)[0];
        sortOrder = this._sortOption[sortKey];
      }

      if (sortKey) {
        results.sort((a, b) => {
          const valA = getNestedValue(a, sortKey);
          const valB = getNestedValue(b, sortKey);
          if (valA === valB) return 0;
          if (valA === undefined || valA === null) return 1;
          if (valB === undefined || valB === null) return -1;
          return valA > valB ? sortOrder : -sortOrder;
        });
      }
    }

    if (this._limitVal !== null && this._limitVal !== undefined) {
      results = results.slice(0, this._limitVal);
    }

    let docs = results.map(d => new Document(d, this.modelName));

    // Simple Population
    for (const pop of this._populatePaths) {
      const pathField = pop.path;
      let refModelName = null;

      // Deduce model name based on property key
      if (pathField.toLowerCase().includes('referreduser') || pathField.toLowerCase().includes('referee')) {
        refModelName = 'User';
      } else if (pathField.toLowerCase().includes('referrer')) {
        refModelName = 'User';
      } else if (pathField.toLowerCase().includes('userid')) {
        refModelName = 'User';
      } else if (pathField.toLowerCase().includes('taskid')) {
        refModelName = 'Task';
      }

      if (refModelName) {
        const refData = readData(refModelName);
        for (const doc of docs) {
          const refId = doc[pathField];
          if (refId) {
            const matchedRef = refData.find(r => r._id.toString() === refId.toString());
            if (matchedRef) {
              const refDoc = new Document(matchedRef, refModelName);
              if (pop.select) {
                const selectFields = typeof pop.select === 'string' ? pop.select.split(' ') : [];
                const selectedDoc = {};
                for (const f of selectFields) {
                  if (f && !f.startsWith('-')) {
                    selectedDoc[f] = refDoc[f];
                  }
                }
                selectedDoc._id = refDoc._id;
                doc[pathField] = selectedDoc;
              } else {
                doc[pathField] = refDoc;
              }
            }
          }
        }
      }
    }

    // Apply projection fields
    if (this._selectFields) {
      let exclude = [];
      let include = [];
      if (typeof this._selectFields === 'string') {
        const fields = this._selectFields.split(' ');
        for (const f of fields) {
          if (f.startsWith('-')) {
            exclude.push(f.substring(1));
          } else if (f) {
            include.push(f);
          }
        }
      }

      docs = docs.map(doc => {
        const raw = doc.toObject();
        const cleaned = {};
        if (include.length > 0) {
          for (const f of include) {
            cleaned[f] = raw[f];
          }
          cleaned._id = raw._id;
        } else {
          Object.assign(cleaned, raw);
          for (const f of exclude) {
            delete cleaned[f];
          }
        }
        return new Document(cleaned, this.modelName);
      });
    }

    if (this.singleResult) {
      return docs[0] || null;
    }
    return docs;
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

// Factory for generating Model Classes
function createModelClass(modelName, schema) {
  class MockModel extends Document {
    constructor(data = {}) {
      const defaultsApplied = applyDefaults(data, schema ? schema.definition : null);
      super(defaultsApplied, modelName);
      if (!this._id) {
        this._id = generateId();
      }
    }

    static find(query = {}) {
      return new MockQuery(modelName, query, false);
    }

    static findOne(query = {}) {
      return new MockQuery(modelName, query, true);
    }

    static findById(id) {
      const idStr = id ? id.toString() : '';
      return new MockQuery(modelName, { _id: idStr }, true);
    }

    static async create(data = {}) {
      const doc = new MockModel(data);
      await doc.save();
      return doc;
    }

    static async insertMany(docsArray) {
      const insertedDocs = [];
      for (const data of docsArray) {
        const doc = new MockModel(data);
        await doc.save();
        insertedDocs.push(doc);
      }
      return insertedDocs;
    }

    static async deleteMany(query = {}) {
      const data = readData(modelName);
      const filtered = data.filter(doc => !matchQuery(doc, query));
      writeData(modelName, filtered);
      return { deletedCount: data.length - filtered.length };
    }

    static async deleteOne(query = {}) {
      const data = readData(modelName);
      const idx = data.findIndex(doc => matchQuery(doc, query));
      if (idx !== -1) {
        data.splice(idx, 1);
        writeData(modelName, data);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    }

    static async updateOne(query = {}, update = {}, options = {}) {
      const data = readData(modelName);
      const idx = data.findIndex(doc => matchQuery(doc, query));
      if (idx !== -1) {
        const doc = data[idx];
        const changes = update.$set || update;
        
        // Handle normal updates
        for (const k of Object.keys(changes)) {
          setNestedValue(doc, k, changes[k]);
        }

        // Handle increment operators
        if (update.$inc) {
          for (const k of Object.keys(update.$inc)) {
            incNestedValue(doc, k, update.$inc[k]);
          }
        }

        writeData(modelName, data);
        return { matchedCount: 1, modifiedCount: 1 };
      }
      if (options.upsert) {
        const newDoc = new MockModel({ ...query, ...(update.$set || update) });
        await newDoc.save();
        return { matchedCount: 1, modifiedCount: 1, upsertedId: newDoc._id };
      }
      return { matchedCount: 0, modifiedCount: 0 };
    }

    static async updateMany(query = {}, update = {}, options = {}) {
      const data = readData(modelName);
      let modifiedCount = 0;
      const changes = update.$set || update;

      for (const doc of data) {
        if (matchQuery(doc, query)) {
          for (const k of Object.keys(changes)) {
            setNestedValue(doc, k, changes[k]);
          }
          if (update.$inc) {
            for (const k of Object.keys(update.$inc)) {
              incNestedValue(doc, k, update.$inc[k]);
            }
          }
          modifiedCount++;
        }
      }

      if (modifiedCount > 0) {
        writeData(modelName, data);
      }
      return { matchedCount: modifiedCount, modifiedCount };
    }

    static async findOneAndUpdate(query = {}, update = {}, options = {}) {
      const data = readData(modelName);
      const idx = data.findIndex(doc => matchQuery(doc, query));

      if (idx === -1) {
        if (options.upsert) {
          const inserted = new MockModel({ ...query, ...(update.$set || update) });
          await inserted.save();
          return inserted;
        }
        return null;
      }

      const doc = data[idx];
      const changes = update.$set || update;
      for (const k of Object.keys(changes)) {
        setNestedValue(doc, k, changes[k]);
      }
      if (update.$inc) {
        for (const k of Object.keys(update.$inc)) {
          incNestedValue(doc, k, update.$inc[k]);
        }
      }

      writeData(modelName, data);
      return new Document(doc, modelName);
    }

    static async findByIdAndUpdate(id, update = {}, options = {}) {
      const idStr = id ? id.toString() : '';
      return this.findOneAndUpdate({ _id: idStr }, update, options);
    }

    static countDocuments(query = {}) {
      const queryObj = new MockQuery(modelName, query, false);
      return queryObj.countDocuments();
    }

    static async aggregate(pipeline = []) {
      const data = readData(modelName);
      let results = [...data];

      for (const stage of pipeline) {
        const stageKey = Object.keys(stage)[0];
        const stageVal = stage[stageKey];

        if (stageKey === '$match') {
          results = results.filter(doc => matchQuery(doc, stageVal));
        } else if (stageKey === '$group') {
          const groupFields = Object.keys(stageVal);
          const groupResult = { _id: stageVal._id };

          for (const f of groupFields) {
            if (f === '_id') continue;
            const groupOpDef = stageVal[f];
            const op = Object.keys(groupOpDef)[0];
            const opVal = groupOpDef[op];

            if (op === '$sum') {
              let sum = 0;
              const fieldName = opVal.startsWith('$') ? opVal.substring(1) : opVal;
              for (const doc of results) {
                sum += Number(getNestedValue(doc, fieldName)) || 0;
              }
              groupResult[f] = sum;
            }
          }
          return [groupResult];
        }
      }
      return results;
    }
  }

  MockModel.schema = schema;
  return MockModel;
}

// Mock Mongoose export
const mongooseMock = {
  Schema: class {
    constructor(definition) {
      this.definition = definition;
      this._preHooks = {};
      this._postHooks = {};
    }
    pre(hookName, fn) {
      if (!this._preHooks[hookName]) this._preHooks[hookName] = [];
      this._preHooks[hookName].push(fn);
    }
    post(hookName, fn) {
      if (!this._postHooks[hookName]) this._postHooks[hookName] = [];
      this._postHooks[hookName].push(fn);
    }
    static get Types() {
      return { ObjectId: 'ObjectId' };
    }
  },
  model: function(name, schema) {
    if (registeredModels[name]) {
      return registeredModels[name];
    }
    const modelClass = createModelClass(name, schema);
    registeredModels[name] = modelClass;
    return modelClass;
  },
  connect: async function(uri, options) {
    // Simulated connection delay
    return {
      connection: {
        host: 'canyuwork_mock_json_db'
      }
    };
  },
  Types: {
    ObjectId: (val) => val ? val.toString() : generateId()
  },
  connection: new EventEmitter(),
  models: registeredModels,
  readData,
  writeData,
  generateId
};

mongooseMock.Schema.Types = { ObjectId: 'ObjectId' };

module.exports = mongooseMock;
