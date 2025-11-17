export class TokenConstant {
  public static readonly token: string = 'profile-information.msal.token';
  public static readonly testtoken: Record<
    'token.id' | 'token.access' | 'token.refresh',
    string
  > = {
    'token.id': 'Test_Token_Id',
    'token.access': 'Test_Token_Access',
    'token.refresh': 'Test_Token_Refresh',
  };
}
