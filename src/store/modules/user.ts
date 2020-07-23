import { Action, getModule, Module, VuexModule } from 'vuex-module-decorators'
import { login, logout, register } from '@/api/user'
import store from '@/store'

export interface UserInterface {
  getUser (): any;
}

// dynamic: 必须为true,否则会无法引用这里的函数
@Module({ name: 'User', dynamic: true, store: store, namespaced: true })
class User extends VuexModule implements UserInterface {
  public user: any

  @Action({ rawError: true })
  public async Login (userInfo: { userName?: string; password: string; phoneNumber?: string; email?: string }) {
    const { data } = await login(userInfo)
    this.user = data
  }

  @Action({ rawError: true })
  public async Register (userName: string, password: string, phoneNumber?: string, email?: string) {
    const { data } = await register({ userName, password, phoneNumber, email })
    this.user = data
  }

  @Action({ rawError: true })
  public async Logout () {
    const { data } = await logout()
    if (data.status) {
      this.user = undefined
    }
  }

  public getUser (): any {
    console.log(this.user)
    return this.user
  }
}

export const UserModule = getModule(User)
