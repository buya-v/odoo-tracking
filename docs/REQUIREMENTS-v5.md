# Odoo tracking - Requirements Document

## Iteration 5

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
install generated application as custom module of odoo

## Refined Requirements
# Technical Specification: Adv Inventory Pro (Iteration 5)

## 1. Project Metadata
*   **Module Technical Name:** `adv_inventory_pro`
*   **Version:** `18.0.5.0.0` (Enterprise Compatible)
*   **Base Dependencies:** `stock`, `barcodes`, `stock_picking_batch`, `resource`, `base_setup`
*   **Platform:** Odoo 18.0 (LGPL/Enterprise)
*   **Objective:** A production-ready inventory engine optimized for high-throughput barcode operations, mobile batch management, and bulletproof inter-company synchronization.

---

## 2. Updated Requirements & Refinements

### 2.1. Odoo Custom Module Compliance (User Feedback)
*   **Structure:** The application must be packaged as a standard Odoo addon directory (`adv_inventory_pro/`) containing `__manifest__.py`, `__init__.py`, `models/`, `views/`, `data/`, `security/`, and `static/`.
*   **Installation Flow:** Must be installable via the Odoo Apps interface. Include an `images/main_screenshot.png` for the app store view.
*   **Data Integrity:** Use `noupdate="1"` for base configuration data to prevent overwriting user customizations during module upgrades.

### 2.2. Robust Error Handling & Tracking (Lessons Learned)
*   **Execution Logging:** Implement a dedicated logging decorator for the "Tracking Execution Path." This must capture stack traces and context (User ID, Record ID, Operation Type) when a sync or barcode operation fails.
*   **Security Audit:** Explicit verification of `ir.model.access.csv`. Ensure the `group_stock_user` and `group_stock_manager` have full CRUD permissions on new tracking models (`adv_inventory.track.log`).
*   **Silent Failures:** Replace generic `except Pass` blocks with `_logger.error(traceback.format_exc())` to ensure visibility in Odoo's log files.

### 2.3. Zero-Latency Barcode & Batch UX (Lessons Learned)
*   **Event Binding:** Fix the click-event regression in the Batch Operation list. List items (e.g., `batch/2023/...`) must use a delegated event listener in the Owl component to trigger the detailed modal or route change.
*   **Mobile-First Design:** Optimize for handheld scanners (Zebra/Honeywell). Buttons must have a minimum touch target of 44x44px.

### 2.4. Global Test Configuration (Lessons Learned)
*   **Timeout Policy:** Update the end-to-end testing suite (Playwright/Odoo Tour).
    *   `navigationTimeout`: 60,000ms.
    *   `waitUntil`: `domcontentloaded` (to avoid hanging on Odoo’s long-polling bus notifications).

---

## 3. UI/UX Design Tokens & Component Breakdown

### 3.1. Design Tokens (Odoo 18 Extended)
| Token | Value | Usage |
| :--- | :--- | :--- |
| `--adv-primary` | `#714B67` (Odoo Purple) | Primary Actions / Headers |
| `--adv-success` | `#00A09D` | Valid Scans / Completed Batches |
| `--adv-danger` | `#DC3545` | Sync Errors / Mis-scans |
| `--adv-warning` | `#FFBB33` | Low Stock / Pending Sync |
| `--adv-surface` | `#F8F9FA` | Mobile List Background |
| `--adv-font-size-barcode` | `1.2rem` | High-visibility text for SKU/Lot |

### 3.2. Core UI Components (Owl/JavaScript)

#### A. `BatchOperationList` (Widget)
*   **Purpose:** High-density list for warehouse pickers.
*   **Interactions:** 
    *   `onItemClick`: Must link to `stock.picking.batch` form view.
    *   `onSwipeLeft`: Quick-assign to current user.
*   **Fix:** Ensure the event listener is bound to the `.o_list_record` class to prevent "dead zones" when clicking text vs. background.

#### B. `BarcodeLiveHeader` (Widget)
*   **Purpose:** Persistent status bar during scanning.
*   **Features:** Displays "Last Scanned," "Sync Status" (Online/Offline), and "Current Batch Efficiency."

#### C. `SyncErrorDashboard` (View)
*   **Purpose:** Admin view for resolving inter-company discrepancies.
*   **Features:** "Retry All" button, "Traceback" modal, and "Diff View" (Source vs. Destination Record).

---

## 4. Feature Prioritization (Iteration 5)

### Priority 1: Core Stability (High)
*   **Task:** Implement the `adv_inventory.track.log` model and the logging decorator.
*   **Task:** Validate and fix `ir.model.access.csv` for UAT user roles.
*   **Acceptance Criteria:** A failed inter-company sync generates a log entry with a full Python traceback visible to the Warehouse Manager.

### Priority 2: Mobile/UX Performance (High)
*   **Task:** Refactor the Batch List click handlers in the Owl JS framework.
*   **Task:** Set up the Playwright `domcontentloaded` wait strategy in the CI/CD pipeline.
*   **Acceptance Criteria:** Clicking any part of a Batch row opens the detail view in <200ms.

### Priority 3: Inter-Company Sync Recovery (Medium)
*   **Task:** Add an automated "Recovery" cron job that retries failed syncs every 30 minutes if the error type is "Connection Timeout."
*   **Acceptance Criteria:** Temporary network drops do not require manual intervention to sync stock moves.

---

## 5. Technical Implementation Details

### 5.1. Error Logging Pattern
```python
def track_inventory_exec(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        try:
            return func(self, *args, **kwargs)
        except Exception as e:
            self.env['adv_inventory.track.log'].create({
                'name': f"Error in {func.__name__}",
                'model_name': self._name,
                'res_id': self.id,
                'traceback': traceback.format_exc(),
                'user_id': self.env.uid,
            })
            raise UserError(_("Operation failed. See tracking logs for details."))
    return wrapper
```

### 5.2. Manifest Configuration (`__manifest__.py`)
```python
{
    'name': 'Adv Inventory Pro',
    'version': '18.0.5.0.0',
    'category': 'Inventory',
    'summary': 'High-performance inventory engine with robust sync.',
    'depends': ['stock', 'barcodes', 'stock_picking_batch'],
    'data': [
        'security/ir.model.access.csv',
        'views/batch_views.xml',
        'views/log_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'adv_inventory_pro/static/src/components/**/*.js',
            'adv_inventory_pro/static/src/components/**/*.xml',
            'adv_inventory_pro/static/src/scss/style.scss',
        ],
    },
    'installable': True,
    'application': True,
}
```

---

## 6. Acceptance Criteria
1.  **Installation:** The module installs on a clean Odoo 18 instance without dependency errors.
2.  **Access Control:** A user with "Inventory / User" rights can create and process batches but cannot delete "Tracking Logs."
3.  **UI Responsiveness:** The "Batch Operation" list correctly responds to clicks on the label `batch/2023/003donewh/out8 ops`.
4.  **Testing:** Automated tours complete within the 60s timeout without timing out on Odoo's internal polling requests.
5.  **Logging:** Every unhandled exception in the sync engine creates a record in `adv_inventory.track.log`.

## Acceptance Criteria
- All features must be fully implemented (no placeholders)
- UI must be responsive and accessible
- Error handling must be comprehensive
- Code must pass TypeScript compilation

---
*Generated by ASLA Product Agent - Iteration 5 - 2026-01-02T09:34:51.474Z*
