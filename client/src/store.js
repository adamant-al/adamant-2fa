import createPersistedState from 'vuex-persistedstate'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  actions: {
    getAccountData: ({ commit, state }) => {
      Vue.axios.get(state.apiUrl + state.session.userId, {
        params: { access_token: state.session.id }
      })
        .then(res => {
          if (res.status === 200) {
            commit('SET_ACCOUNT', res.data)
          } else console.warn(res)
        })
        .catch(err => console.error(err))
    }
  },
  getters: {
    account: state => state.account,
    apiUrl: state => state.apiUrl,
    session: state => state.session,
    sessionTimeLeft: state => {
      return (
        Date.parse(state.session.created) +
        state.session.timeDelta +
        state.session.ttl
      ) - Date.now()
    }
  },
  mutations: {
    CLEAR_SESSION: state => {
      // Shallow iteration
      for (let k in state.session) {
        if (state.session.hasOwnProperty(k)) {
          state.session[k] = null
        }
      }
      state.session.lastSeen = Date.now()
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_SESSION: (state, session) => {
      state.session = session
    },
    UPDATE_ACCOUNT: (state, account) => {
      Object.assign(state.account, account)
    },
    UPDATE_SESSION: (state, session) => {
      Object.assign(state.session, session)
    }
  },
  plugins: [
    createPersistedState({ storage: window.localStorage })
  ],
  state: {
    account: {
      adamantAddress: null,
      id: null,
      locale: null,
      se2faEnabled: null,
      username: null
    },
    apiUrl: 'http://localhost:3000/api/Accounts/',
    session: {
      created: null, // Created ISO timestamp string
      id: null, // Access token
      lastSeen: null, // Indicates that user had been logged at least once
      timeDelta: null, // Difference between server and client time
      ttl: null, // Time to live, 20 minutes 16 seconds approximately by default
      verified: null // Indicates that user logged in and passed 2FA
    }
  }
})
