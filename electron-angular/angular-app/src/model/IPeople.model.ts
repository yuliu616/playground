import { ModelDef } from './ModelDef';

/**
 * people is, a human being (not necessarily alive).
 * (for model[people])
 */
export interface IPeople {

  id?: number;

  version?: number;

  creation_date?: Date|string;

  last_updated?: Date|string;

  first_name?: string;

  /**
   * Last name is the family name
   */
  last_name?: string;

  /**
   * less formal name to call
   */
  nickname?: string;

  gender?: string;

  date_of_birth?: Date|string;

  weight_in_kg?: number;

} // closing of interface

let PeopleModelMeta: ModelDef = {"name":"people","className":"People","tableName":"people","description":"people is, a human being (not necessarily alive).","fields":{"id":{"type":"number","isId":true},"version":{"type":"number","autoFilled":true},"creation_date":{"type":"Date","autoFilled":true},"last_updated":{"type":"Date","autoFilled":true},"first_name":{"type":"string","required":true},"last_name":{"type":"string","description":"Last name is the family name"},"nickname":{"type":"string","description":"less formal name to call"},"gender":{"type":"string","required":true},"date_of_birth":{"type":"Date","required":true},"weight_in_kg":{"type":"number"},"dead_cert":{"type":"model","modelType":"DeadCert","modelNameSpace":"people","byInverseLinkField":"dead_person_id"}}};
export { PeopleModelMeta }
