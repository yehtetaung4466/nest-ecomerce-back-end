import { PostgresError } from 'postgres';

export function handleDbError(
  condition: boolean,
  err: any,
  cb: () => any | void,
) {
  if (condition) cb();
  // else throw new Error(err);
}
export function checkIfPostgresError(err) {
  if (!(err instanceof PostgresError)) {
    throw new Error(err);
  } else {
    return err;
  }
}
