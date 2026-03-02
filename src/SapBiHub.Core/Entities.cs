using System;
using System.Collections.Generic;

namespace SapBiHub.Core.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public Role? Role { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty; // Admin, DataEngineer, Analyst, Viewer, Auditor
    }

    public class Query
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Endpoint { get; set; } = string.Empty; // e.g., /Invoices
        public string OdataJson { get; set; } = string.Empty; // select/filter/order/top/paging
        public string TransformJson { get; set; } = string.Empty;
        public bool Locked { get; set; }
        public int OwnerUserId { get; set; }
        public User? Owner { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Dataset
    {
        public int Id { get; set; }
        public int QueryId { get; set; }
        public Query? Query { get; set; }
        public string TargetTable { get; set; } = string.Empty; // ds_xxx
        public int RefreshMinutes { get; set; }
        public string Mode { get; set; } = "FULL"; // FULL, INCREMENTAL
        public string? IncrementalKey { get; set; } // e.g., DocEntry or UpdateDate
        public string? WatermarkValue { get; set; }
        public string? LastRunStatus { get; set; }
        public DateTime? LastRunAt { get; set; }
    }

    public class QueryRun
    {
        public int Id { get; set; }
        public int DatasetId { get; set; }
        public Dataset? Dataset { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime FinishedAt { get; set; }
        public string Status { get; set; } = string.Empty; // OK, FAIL
        public int RowsWritten { get; set; }
        public long DurationMs { get; set; }
        public string? HttpCalls { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
