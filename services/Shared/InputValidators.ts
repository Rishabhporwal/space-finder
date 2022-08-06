import { Space } from "./Model";
export class MissingFieldError extends Error {}

export function ValidateAsSpaceEntry(arg: any) {
  if (!(arg as Space).name) {
    throw new MissingFieldError("Value for anme required!");
  }

  if (!(arg as Space).location) {
    throw new MissingFieldError("Value for anme required!");
  }

  if (!(arg as Space).spaceId) {
    throw new MissingFieldError("Value for anme required!");
  }
}
