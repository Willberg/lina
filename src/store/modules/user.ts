import { Action, getModule, Module, VuexModule } from 'vuex-module-decorators'
import { login, logout } from '@/api/user'
import { getToken, removeToken } from '@/utils/cookie'
import store from '@/store'

export interface UserStateInterface {
  token: string;
}

// dynamic: 必须为true,否则会无法引用这里的函数
@Module({ name: 'User', dynamic: true, store: store, namespaced: true })
class User extends VuexModule implements UserStateInterface {
  public token = getToken() || ''

  @Action({ rawError: true })
  public async Login (userInfo: { userName: string; password: string; phoneNumber: string; email: string }) {
    await login(userInfo)
  }

  @Action({ rawError: true })
  public async Logout () {
    const { data } = await logout()
    if (data.status) {
      removeToken()
    }
  }
}

export const UserModule = getModule(User)
