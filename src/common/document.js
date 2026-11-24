import { BSONType, Int32 } from 'mongodb';

const accepts = {
  [BSONType.string]: (value) => typeof value === 'string' && value.trim() !== '',
  [BSONType.int]: (value) =>
    Number.isInteger(value) && value >= -2147483648 && value <= 2147483647,
  [BSONType.bool]: (value) => typeof value === 'boolean',
  [BSONType.array]: Array.isArray,
};

export function validateDocument(schema, input, { partial = false } = {}) {
  const document = {};
  for (const [field, type] of Object.entries(schema)) {
    if (field === '_id' || (partial && !Object.hasOwn(input, field))) {
      continue;
    }

    const value = input[field];
    if (!accepts[type](value)) {
      return { error: `El campo "${field}" falta o tiene un tipo inválido.` };
    }

    document[field] = type === BSONType.int ? new Int32(value) : value;
  }

  if (Object.keys(document).length === 0) {
    return { error: 'Indica al menos un campo editable.' };
  }
  return { document };
}
