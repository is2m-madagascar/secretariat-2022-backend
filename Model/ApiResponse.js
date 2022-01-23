class ApiResponse {
  constructor({ data = [], errors = [], message = [] }) {
    this.data = data;
    this.errors = errors;
    this.message = message;
  }

  toJson() {
    return {
      data: this.data,
      errors: this.errors,
      message: this.message,
    };
  }
}

module.exports = { ApiResponse };
