const renderResp = {
  ERROR_401: msg => ({
    code: 401,
    msg
  }),

  ERROR_403: msg => ({
    code: 403,
    msg
  }),

  ERROR_404: msg => ({
    code: 404,
    msg
  }),

  ERROR_412: (msg, data) => ({
    code: 412,
    msg,
    data
  }),

  SUCCESS_200: (msg, data, meta = {}) => ({
    code: 200,
    msg,
    data,
    meta
  })
}

module.exports = renderResp
