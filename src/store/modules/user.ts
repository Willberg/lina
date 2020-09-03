import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { login, logout, register } from '@/api/user'
import store from '@/store'
import { USER } from "@/constant/storageConstant";

// dynamic: 必须为true,否则会无法引用这里的函数
@Module({ name: 'User', dynamic: true, store: store, namespaced: true })
class User extends VuexModule {
  user = localStorage.getItem(USER) || undefined

  get userProfile () {
    return this.user
  }

  @Mutation
  setUser (user: any) {
    this.user = user
  }

  @Action({ rawError: true })
  public async Login (userInfo: { userName?: string; password: string; phoneNumber?: string; email?: string }) {
    const result = await login(userInfo)
    if (result.status) {
      this.context.commit('setUser', result.data)
    }
    return result.status
  }

  @Action({ rawError: true })
  public async Register (registerInfo: { userName: string, password: string, phoneNumber?: string, email?: string }) {
    const result = await register(registerInfo)
    if (result.status) {
      this.context.commit('setUser', result.data)
    }
    return result.status
  }

  @Action({ rawError: true })
  public async Logout () {
    const result = await logout()
    if (result.status) {
      this.context.commit('setUser', undefined)
      localStorage.clear()
    }
    return result.status
  }
}

export const UserModule = getModule(User)
