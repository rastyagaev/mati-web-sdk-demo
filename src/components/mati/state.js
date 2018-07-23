const initialState = {
  loading: false
}

function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action)
    } else {
      return state
    }
  }
}

function createTypesSequence(baseName) {
  return ['REQUEST', 'SUCCESS', 'FAILURE'].reduce((object, item) => {
    const type = `${baseName}_${item}`
    object[type] = type
    return object
  }, {})
}

export const types = {
  ...createTypesSequence('CREATE_IDENTITY'),
  ...createTypesSequence('UPLOAD_DOCUMENT_FRONT'),
  ...createTypesSequence('UPLOAD_DOCUMENT_BACK'),
  ...createTypesSequence('GET_DOCUMENT'),
  ...createTypesSequence('GET_IDENTITY')
}

export const createIdentity = (client, image) => dispatch => {
  dispatch({ type: types.CREATE_IDENTITY_REQUEST })
  return client
    .createIdentity(image)
    .then(identity => {
      dispatch({ type: types.CREATE_IDENTITY_SUCCESS, identity })
      return identity
    })
    .catch(dispatch({ type: types.CREATE_IDENTITY_FAILURE }))
}

export const uploadDocumentFrontSide = (
  client,
  identityId,
  documentType,
  photo
) => dispatch => {
  dispatch({ type: types.UPLOAD_DOCUMENT_FRONT_REQUEST })
  return client
    .uploadDocumentFrontSide(identityId, documentType, photo)
    .then(document => {
      dispatch({ type: types.UPLOAD_DOCUMENT_FRONT_SUCCESS, document })
      return document
    })
    .catch(dispatch({ type: types.UPLOAD_DOCUMENT_FRONT_FAILURE }))
}

export const uploadDocumentBackSide = (
  client,
  identityId,
  photo
) => dispatch => {
  dispatch({ type: types.UPLOAD_DOCUMENT_BACK_REQUEST })
  return client
    .uploadDocumentBackSide(identityId, photo)
    .then(document => {
      dispatch({ type: types.UPLOAD_DOCUMENT_BACK_SUCCESS, document })
      return document
    })
    .catch(dispatch({ type: types.UPLOAD_DOCUMENT_BACK_FAILURE }))
}

export const getDocument = (client, documentId) => dispatch => {
  dispatch({ type: types.GET_DOCUMENT_REQUEST })
  return client
    .getDocument(documentId)
    .then(document => {
      dispatch({ type: types.GET_DOCUMENT_SUCCESS, document })
      return document
    })
    .catch(dispatch({ type: types.GET_DOCUMENT_FAILURE }))
}

export const getIdentity = (client, identityId) => dispatch => {
  dispatch({ type: types.GET_IDENTITY_REQUEST })
  return client
    .getIdentity(identityId)
    .then(identity => {
      dispatch({ type: types.GET_IDENTITY_SUCCESS, identity })
      return identity
    })
    .catch(dispatch({ type: types.GET_IDENTITY_FAILURE }))
}

export const reducer = createReducer(initialState, {
  [types.CREATE_IDENTITY_REQUEST]: (state, action) => ({
    ...state,
    document: null,
    identity: null,
    loading: true
  }),
  [types.CREATE_IDENTITY_SUCCESS]: (state, { identity }) => ({
    ...state,
    identity,
    loading: false
  }),
  [types.UPLOAD_DOCUMENT_FRONT_REQUEST]: (state, action) => ({
    ...state,
    loading: true
  }),
  [types.UPLOAD_DOCUMENT_FRONT_SUCCESS]: (state, { document }) => ({
    ...state,
    document,
    loading: false
  }),
  [types.UPLOAD_DOCUMENT_BACK_REQUEST]: (state, action) => ({
    ...state,
    loading: true
  }),
  [types.UPLOAD_DOCUMENT_BACK_SUCCESS]: (state, { document }) => ({
    ...state,
    document,
    loading: false
  }),
  [types.GET_DOCUMENT_SUCCESS]: (state, { document }) => ({
    ...state,
    document
  }),
  [types.GET_IDENTITY_SUCCESS]: (state, { identity }) => ({
    ...state,
    identity
  })
})
