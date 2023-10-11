export class AuthenticationConfiguration {
  public static readonly applicationId: string =
    '94439608-4fe3-4622-9f4f-cb4b30bf59af';
  public static readonly authority: string =
    'https://login.microsoftonline.com/common';
  public static readonly scopes: string[] = ['OpenId', 'User.Read', 'profile'];
}
