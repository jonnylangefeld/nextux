/**
 * ts-to-zod configuration.
 * @type {import("ts-to-zod").TsToZodConfig}
 */
module.exports = [
  {
    name: 'types',
    input: 'src/app/lib/proto/types.ts',
    output: 'src/app/lib/proto/schemas.ts',
    nameFilter: (name) => !['DeepPartial', 'KeysOfUnion', 'Exact', 'Builtin'].includes(name),
  },
]
