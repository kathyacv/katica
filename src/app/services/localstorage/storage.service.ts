import { Injectable } from '@angular/core';


interface MixedStorage {
  getItem(key: string): any | Promise<any>
  removeItem?(key: string): any | Promise<any>
  remove?(key: string): Promise<any>
  setItem(key: string, value: any): any | Promise<any>
}

export enum StorageKey {
  Cart = "cart",
}

export enum StorageError {
  NullData = "Null data"
}

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  storageValueList: { [preference: string]: any } = {}

  constructor() { }

  private get storage(): MixedStorage {
    return  localStorage;
  }

  async set<T>(preference: string, value: T): Promise<T> {
    await this.storage.setItem(preference, JSON.stringify(value))
    this.storageValueList[preference] = value
    return value
  }

  async get<T>(preference: string, returnNull: boolean = false): Promise<T> {
    let value = this.storageValueList[preference]
    if (value)
      return value

    const data = await this.storage.getItem(preference);
    const parseData = JSON.parse(data)
    
    if (!parseData) this.storageValueList[preference] = parseData;
    return parseData
  }

  async remove(preference: string) {
    if (this.storage.removeItem)
      localStorage.removeItem(preference)
    if (this.storage.remove)
      await this.storage.remove(preference)
    this.storageValueList[preference] = null
  }

  async removeAll() {
    await Object.values(StorageKey).forEach((preference: any) => {
      if (this.storage.removeItem)
        localStorage.removeItem(preference)
      if (this.storage.remove)
        this.storage.remove(preference)
      this.storageValueList[preference] = null
    })
  }
}
