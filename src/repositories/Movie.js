import { EntitySchema } from 'typeorm';

export const Movie = new EntitySchema({
  name: 'Movie',
  tableName: 'movies',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true
    },
    year: {
      type: 'int',
      nullable: false
    },
    title: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    studios: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    producers: {
      type: 'varchar',
      length: 255,
      nullable: false
    },
    winner: {
      type: 'varchar',
      length: 3,
      nullable: true
    }
  }
});
