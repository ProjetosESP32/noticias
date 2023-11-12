declare module '@ioc:Adonis/Lucid/Database' {
  interface DatabaseQueryBuilderContract {
    getCount: () => Promise<bigint>
  }
}
