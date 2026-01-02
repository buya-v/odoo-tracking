# Odoo tracking - Requirements Document

## Iteration 3

## Project Description
Develop a custom Odoo 18 module for advanced inventory tracking with barcode integration and multi-warehouse, multi-company support.

## Customer Persona
- **Name**: Marcus Thorne
- **Role**: Director of Supply Chain Operations
- **Goals**: Achieve real-time inventory accuracy across 12 global warehouses and 4 legal entities; Streamline the picking and packing process using high-speed barcode integration to reduce fulfillment latency; Ensure the custom codebase is future-proof and compliant with Odoo 18 standards for easy future migrations

## Target Users
- **Alejandro Rodriguez** (Primary User): Process picking lists as fast as possible to meet daily KPIs
- **Sarah Jenkins** (Primary User): Reconcile physical stock counts with digital records across multiple warehouses
- **David Wu** (Secondary User): Verify that every stock move between Company A and Company B is documented correctly

## Key User Stories (Must-Have)
- Rapid Scan-to-Validate Interface
- Inter-Company Transfer Automation
- Multi-Company Record Rules

## User Feedback Incorporated
need a fully workable solution

## Refined Requirements
# Technical Specification: Adv Inventory Pro (Iteration 3)

## 1. Project Metadata
*   **Module Technical Name:** `adv_inventory_pro`
*   **Version:** 18.0.3.0.0 (Enterprise)
*   **Base Dependencies:** `stock`, `barcodes`, `stock_picking_batch`, `resource`, `base_setup`
*   **Core Objective:** A production-ready, "fully workable" high-throughput inventory engine focusing on zero-latency barcode processing, mobile-first batch management, and bulletproof inter-company synchronization.

---

## 2. Iteration 3 Strategic Focus
Based on Iteration 2 feedback, this version prioritizes **Reliability and Visibility**.
1.  **Fault Tolerance:** Transition from silent failures to informative UI-driven error propagation.
2.  **Security Rigor:** Complete audit of `ir.model.access.csv` and record rules.
3.  **Performance:** Optimized tracking controller for sub-100ms barcode response times.
4.  **UX Polish:** Mobile-first feedback loops (haptic and visual) for batch operations.

---

## 3. Functional Requirements

### 3.1. High-Speed Barcode Validation (Controller-Level)
*   **Logic:** Implement a custom `StockBarcodeController` that wraps the standard Odoo barcode logic but adds a pre-validation layer.
*   **Error Handling:** Use a standardized `try-except` block for all external API calls or complex calculations.
*   **Feedback:** Raise `odoo.exceptions.UserError` for business logic failures and log full stack traces for system-level crashes.

### 3.2. Mobile-First Batch Picking
*   **Dynamic Sequencing:** Automatically sort picking lines by "Optimal Path" (Warehouse Bin Location) to minimize walking distance.
*   **Validation:** Prevent closing a batch if there are unfulfilled lines unless a "Partial Force" permission is granted to the user.

### 3.3. Inter-Company Stock Sync (ICS)
*   **Real-time Propagation:** When a transfer is validated in Company A, the corresponding "In Transit" move in Company B must be updated or created.
*   **Conflict Resolution:** If quantities mismatch during sync, the system must flag the record as "Sync Error" and notify the Warehouse Manager.

---

## 4. Technical Architecture & Backend

### 4.1. Error Propagation Pattern
All controller methods must follow this structure to prevent "Unknown Issue" fallbacks:
```python
def process_barcode(self, barcode, picking_id):
    try:
        # Business Logic
        res = self._validate_scan(barcode, picking_id)
        return res
    except UserError as e:
        return {'error': e.args[0], 'type': 'business'}
    except Exception as e:
        _logger.error("Barcode Sync Failed: %s", traceback.format_exc())
        return {'error': "System error: Please contact admin.", 'type': 'critical'}
```

### 4.2. Data Models
*   **`adv_inventory.sync_log`**: To track inter-company transaction payloads and success/failure states.
*   **`stock.picking.batch` (Inherited)**: Added fields: `path_optimized` (boolean), `last_sync_error` (text).

### 4.3. Security (ACL)
Verification of `ir.model.access.csv`:
| id | name | model_id:id | group_id:id | perm_read | perm_write | perm_create | perm_unlink |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| access_adv_inv_pro_user | Adv Inv User | model_adv_inventory_sync_log | stock.group_stock_user | 1 | 1 | 1 | 0 |
| access_adv_inv_pro_manager | Adv Inv Mgr | model_adv_inventory_sync_log | stock.group_stock_manager | 1 | 1 | 1 | 1 |

---

## 5. UI/UX Design Tokens & Components

### 5.1. Design Tokens (Odoo 18 Context)
| Token | Value | Usage |
| :--- | :--- | :--- |
| `--adv-inv-success` | #28a745 | Valid scan/sync green |
| `--adv-inv-error` | #dc3545 | Critical failure red |
| `--adv-inv-warning` | #ffc107 | Quantity mismatch yellow |
| `--adv-inv-font-mono` | 'Roboto Mono', monospace | Barcode strings and ID numbers |

### 5.2. Component Breakdown (OWL - Odoo Web Library)
1.  **`AdvBarcodeStatus`**:
    *   **Visual:** A sticky header bar in the mobile view.
    *   **Behavior:** Flashes green on success, vibrates on error (using `navigator.vibrate`), and displays the specific `UserError` message.
2.  **`BatchProgressCard`**:
    *   **Visual:** Circular progress indicator for batch completion percentage.
    *   **Behavior:** Real-time updates as scans are validated.
3.  **`SyncIssueWidget`**:
    *   **Visual:** A warning icon on `stock.picking` form views if inter-company sync is pending or failed.

---

## 6. Acceptance Criteria (Iteration 3)

| Feature | Acceptance Criteria |
| :--- | :--- |
| **Error Handling** | Scanning an invalid barcode must return a specific message (e.g., "Product X not in Batch Y") rather than a generic "Server Error". |
| **ACL Verification** | A user with "Inventory / User" rights can validate a scan and log a sync error but cannot delete sync logs. |
| **Logging** | Every failed inter-company sync must generate an entry in `adv_inventory.sync_log` with a full stack trace in the backend log. |
| **Mobile UX** | The "Validate" button on the batch picking screen must remain disabled until all required items are scanned or a manager override is provided. |
| **Latency** | Barcode validation controller must respond in <150ms on a standard 4G connection. |

---

## 7. Prioritized Feature Backlog
1.  **High Priority:** Robust Error Propagation (Controller rewrite).
2.  **High Priority:** Security/ACL Audit (UAT user verification).
3.  **Medium Priority:** Optimal Path Sorting for Batch Picking.
4.  **Low Priority:** Haptic Feedback (Vibration) integration for mobile scanners.

---

## 8. Lessons Learned Implementation
*   **Silent Failures:** Resolved by wrapping the Tracking Controller in specific `try-except` blocks.
*   **UAT Issues:** Resolved by explicitly defining the `ir.model.access.csv` to ensure the UAT user is not blocked by permission errors during "Workable Solution" testing.

## Acceptance Criteria
- All features must be fully implemented (no placeholders)
- UI must be responsive and accessible
- Error handling must be comprehensive
- Code must pass TypeScript compilation

---
*Generated by ASLA Product Agent - Iteration 3 - 2026-01-02T07:04:35.973Z*
