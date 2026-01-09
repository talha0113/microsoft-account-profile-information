export class AuthenticationConfiguration {
  public static readonly applicationId: string =
    'e5a6e3e8-7a9e-47d7-b0bd-0d78ebe60257';
  public static readonly authority: string =
    'https://login.microsoftonline.com/7e593fb7-6cc2-4623-9e6b-8564cd5ca40d';
  public static readonly scopes: string[] = ['OpenId', 'User.Read', 'profile'];
}
