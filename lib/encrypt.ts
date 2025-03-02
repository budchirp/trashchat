import * as bcrypt from 'bcrypt'

export class Encrypt {
  private static rounds = 10

  public static encrypt = async (data: string): Promise<string> => {
    return await bcrypt.hash(data, Encrypt.rounds)
  }

  public static compare = async (data: string, encrypted: string): Promise<boolean> => {
    return await bcrypt.compare(data, encrypted)
  }
}
