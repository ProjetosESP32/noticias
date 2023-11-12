declare module '@ioc:Adonis/Lucid/Orm' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
    getCount: () => Promise<bigint>
  }
}
