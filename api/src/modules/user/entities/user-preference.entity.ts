export class UserPreferenceEntity {
  id: number;
  displayName: string;

  constructor(id: number, displayName: string) {
    this.id = id;
    this.displayName = displayName;
  }
}
