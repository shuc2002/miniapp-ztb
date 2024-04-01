/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 1000,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  SERVICE_UNAVAILABLE = 500,
  FAILED = 1001,
  SYSTEM_EXCEPTION = 1002,
  DO_LOGIN = 1010,
  NEED_REGISTER = 1011,
  ARGUMENT_NOT_VALID = 3000,
  MSG_FORMAT_ERROR = 3001,
  MEDIA_TYPE_ERROR = 3002,
  MISS_ARGUMENT = 3003,
  INCORRECT_CHANNEL = 2000,
  THIRD_SERVER_BUSY = 2001,
  SEEION_TIMEOUT = 2002,
  RETRY_LATER = 2003,
  TIMEOUT = 2004,
  CODE_INVALID = 2005,
  DUPLICATE_DATA = 2006,
  NOT_PARENT_NODE = 2007,
  PERMISSION_SIGN_EXISTS = 2008,
  VERSION_CODE_ERROR = 2011,
  USER_UNAUTHORIZED = 2012,
  COMMODITY_TYPE_NOT_SAME = 2013,
  QUERY_PARAM_ERR = 2014,
  INCCORRECT_PARAMS = 2014,
  MUST_CHOICES_ONE = 2015,
  WRIONG_STATUS = 2016,
  REGISTERED = 2017,
  OPTION_REPEAT = 2018,
  NO_CROWD_DATA = 2019,
  RE_SIGNED = 2029,
  REPEAT_JOIN = 3500,
  OUR_JOIN = 3503,
  USER_NOT_EXIST = 2063,
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  contentTyp
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}
