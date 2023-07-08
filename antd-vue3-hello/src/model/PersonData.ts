import dayjs from 'dayjs';
import { PromiseUtil } from '@/util/PromiseUtil';

export interface Person {
  id?: number;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string; // date in string
  age?: number;
  gender?: string; // enum
  heightInCm?: number;
  weightInKg?: number;
}

const PERSON_DATA_FULL_LIST: Person[] = [
  {
    id: 1001,
    firstName: 'John',
    lastName: 'Chan',
    dateOfBirth: '2000-01-01',
    age: 23,
    gender: 'MALE',
    heightInCm: 165,
    weightInKg: 56.4,
  },
  {
    id: 1002,
    firstName: 'William',
    lastName: 'Chan',
    dateOfBirth: '1998-01-25',
    age: 25,
    gender: 'MALE',
    heightInCm: 184,
    weightInKg: 75.2,
  },
  {
    id: 1003,
    firstName: 'Rose',
    lastName: 'Chan',
    dateOfBirth: '1995-02-26',
    age: 28,
    gender: 'FEMALE',
    heightInCm: 158,
    weightInKg: 49.8,
  },
  {
    id: 1004,
    firstName: 'Ricky',
    lastName: 'Chan',
    dateOfBirth: '2002-10-16',
    age: 21,
    gender: 'MALE',
    heightInCm: 188,
    weightInKg: 72.1,
  },
];
for (let i=0;i<32;i++) {
  let clone: Person = {};
  Object.assign(clone, PERSON_DATA_FULL_LIST[0]);
  clone.age = 12 + Math.floor(50.0 * Math.random());
  clone.dateOfBirth = dayjs()
    .add(-clone.age, 'year')
    .add(Math.floor(300*Math.random()), 'day')
    .format('YYYY-MM-DD');
  clone.gender = Math.random() > 0.5 ? "MALE" : "FEMALE";
  if (clone.gender == 'MALE') {
    clone.firstName = "Peter";
    clone.heightInCm = 150 + Math.floor(50 * Math.random());
    clone.weightInKg = (500 + Math.floor(400 * Math.random())) / 10;
  } else {
    clone.firstName = "Marry";
    clone.heightInCm = 140 + Math.floor(40 * Math.random());
    clone.weightInKg = (400 + Math.floor(350 * Math.random())) / 10;
  }
  clone.id = PERSON_DATA_FULL_LIST[PERSON_DATA_FULL_LIST.length-1].id! +1;
  PERSON_DATA_FULL_LIST.push(clone);
}

/**
 * fetch data with paging (offset+limit)
 */
export async function fetchPersonList(options: {offset: number, limit: number}) {
  await PromiseUtil.wait(2000);
  let data = await Promise.resolve(PERSON_DATA_FULL_LIST);
  return data.slice(options.offset, options.offset+options.limit);
};
