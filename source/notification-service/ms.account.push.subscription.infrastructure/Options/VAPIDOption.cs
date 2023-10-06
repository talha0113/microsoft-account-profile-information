namespace ms.account.push.subscription.infrastructure.options;

public sealed class VAPIDOption
{
    public string Subject { get; set; }

    public string PublicKey { get; set; }

    public string PrivateKey { get; set; }
}
