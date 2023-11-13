export const errorResponseMock = {
  operationId: '8c771ada-ffd4-4335-aef4-8a04b101c4d5',
  created: '2022-12-14T12:31:27.2901444+00:00',
  status: 'Failed',
  error: {
    code: 'dwgConversionProblem',
    details: [
      {
        code: 'failed',
        details: [
          {
            code: 'geometryError',
            message: 'At birth, a baby panda is smaller than a mouse.',
            innererror: {
              code: 'unhandledException',
              message: null,
            },
          },
          {
            code: 'internalFailure',
            message: "The tongue is the only muscle in one's body that is attached from one end.",
            innererror: {
              code: null,
              message: 'Issue with entity or entities in this layer.',
            },
          },
          {
            code: 'dwgError',
            message:
              "The voice actor of SpongeBob and the voice actor of Karen, Plankton's computer wife, have been married since 1995.",
            innererror: {
              code: null,
              message: 'Issue with entity or entities in this layer.',
            },
          },
        ],
      },
    ],
  },
};
