import User from '../../../models/userModel';

describe('User model schema', () => {
  it('should have a unique username property type string', () => {
    const userSchema = User.schema.paths;
    expect(userSchema.username).toBeDefined();
    expect(userSchema.username.instance).toBe('String');
    expect(userSchema.username.options.required).toBe(true);
    expect(userSchema.username.options.unique).toBe(true);
  });

  it('should have a password property type string', () => {
    const userSchema = User.schema.paths;
    expect(userSchema.password).toBeDefined();
    expect(userSchema.password.instance).toBe('String');
    expect(userSchema.password.options.required).toBe(true);
  });

  it('should have a phone property type string', () => {
    const userSchema = User.schema.paths;
    expect(userSchema.phone).toBeDefined();
    expect(userSchema.phone.instance).toBe('String');
  });

  it('should have a role property type string', () => {
    const userSchema = User.schema.paths;
    expect(userSchema.role).toBeDefined();
    expect(userSchema.role.instance).toBe('String');
    expect(userSchema.role.options.required).toBe(true);
  });

  it('should have a mentorId property of type ObjectId and reference User model itself', () => {
    const studentSchema = User.schema.paths;
    expect(studentSchema.mentorId).toBeDefined();
    expect(studentSchema.mentorId.instance).toBe('ObjectId');
    expect(studentSchema.mentorId.options.ref).toBe('User');
  });

  it('should have a raportIdsStudent property that is an array of objects', () => {
    const studentSchema = User.schema.paths;
    expect(studentSchema.raportIdsStudent).toBeDefined();
    expect(studentSchema.raportIdsStudent.instance).toBe('Array');

    const embeddedSchema = studentSchema['raportIdsStudent'].schema.paths;
    expect(embeddedSchema['raportId'].instance).toBe('ObjectId');
    expect(embeddedSchema['raportId'].options.ref).toBe('Raport');
    expect(embeddedSchema['raportName'].instance).toBe('String');
  });

  it('should have a raportIdsStudent property that is an array of objects', () => {
    const studentSchema = User.schema.paths;
    expect(studentSchema.raportIdsStudent).toBeDefined();
    expect(studentSchema.raportIdsStudent.instance).toBe('Array');

    const embeddedSchema = studentSchema['raportIdsStudent'].schema.paths;
    expect(embeddedSchema['raportId'].instance).toBe('ObjectId');
    expect(embeddedSchema['raportId'].options.ref).toBe('Raport');
    expect(embeddedSchema['raportName'].instance).toBe('String');
  });
  
  it('should have a raportIdsStudent property that is an array of objects', () => {
    const studentSchema = User.schema.paths;
    expect(studentSchema.raportIdsStudent).toBeDefined();
    expect(studentSchema.raportIdsStudent.instance).toBe('Array');

    const embeddedSchema = studentSchema['raportIdsStudent'].schema.paths;
    expect(embeddedSchema['raportId'].instance).toBe('ObjectId');
    expect(embeddedSchema['raportId'].options.ref).toBe('Raport');
    expect(embeddedSchema['raportName'].instance).toBe('String');
  });
});
