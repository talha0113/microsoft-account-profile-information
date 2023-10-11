namespace ms.account.push.subscription.core.models;

public class HealthCheckModel
{
    public string? Status { get; set; }
    public IEnumerable<HealthCheckItemModel>? Items { get; set; }
}

public class HealthCheckItemModel
{
    public string? Status { get; set; }
    public string? Component { get; set; }
    public string? Description { get; set; }
}
