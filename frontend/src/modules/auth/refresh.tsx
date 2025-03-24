interface ReturnResponse {
  status: number;
  message: string;
};

export const getAccessToken = async (): Promise<ReturnResponse> => {
  try {
    const headers: Headers = new Headers();
    headers.set('content-type', 'application/json');
    headers.set('Accept', 'application/json');

    const request: Request = new Request('http://localhost/api/auth/refresh', {
      method: 'POST',
      headers: headers,
      credentials: 'include'
    });

    const response = await fetch(request);
    const data: { message: string } = await response.json();
    const ReturnResponse: ReturnResponse = {
      status: response.status,
      message: data.message
    };

    return ReturnResponse;
  } catch (error) {
    return {
      status: 400,
      message: `Error generating new accesss token: ${error}`
    };
  }
}; 