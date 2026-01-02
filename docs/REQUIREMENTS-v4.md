# Odoo tracking - Requirements Document

## Iteration 4

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
need fully functional module

## Refined Requirements
# Technical Specification: Adv Inventory Pro (Iteration 4)

## 1. Project Metadata
*   **Module Technical Name:** `adv_inventory_pro`
*   **Version:** 18.0.4.0.0 (Enterprise)
*   **Base Dependencies:** `stock`, `barcodes`, `stock_picking_batch`, `resource`, `base_setup`
*   **Core Objective:** A production-ready, high-throughput inventory engine focusing on zero-latency barcode processing, mobile-first batch management, and bulletproof inter-company synchronization with advanced error recovery.

---

## 2. Executive Summary of Refinement
Based on Iteration 3 feedback, Iteration 4 moves from "Feature Complete" to "Production Hardened." Key focus areas include **Error Propagation Transparency**, **UAT Environment Stability**, and **Testing Resilience**. We are eliminating "silent failures" by replacing generic backend errors with actionable UI notifications.

---

## 3. Technical Architecture & Component Breakdown

### 3.1. Zero-Latency Barcode Controller (`/adv_inventory/barcode`)
*   **Logic:** Overrides the standard barcode scanning route to implement a "Check-then-Commit" pattern.
*   **Error Handling (New):**
    *   Wrapped in `try-except` blocks targeting `UserError`, `ValidationError`, and `AccessError`.
    *   **Specific Requirement:** If an external API call (e.g., carrier tracking) fails, the system must log the full stack trace to `ir.logging` but present a human-readable `UserError` to the scanner UI.
*   **Async Processing:** Utilize `odoo.tools.bus` to push scan confirmations to the UI without waiting for full database commit cycles.

### 3.2. Tracking & Inter-company Engine
*   **Models Extended:** `stock.picking`, `stock.move.line`.
*   **Security:** Comprehensive `ir.model.access.csv` ensuring the `group_stock_user` has full CRUD permissions on all new tracking entities.
*   **Conflict Resolution:** Implements a "Last Write Wins" strategy for inter-company stock moves, with an audit log stored in a new model `adv.inventory.sync.log`.

### 3.3. Batch Management (Mobile-First)
*   **View:** Specialized Kanban view optimized for 5.5" handheld scanners.
*   **Logic:** Automated batching based on "Wave Proximity" (grouping picks by the shortest physical path in the warehouse).

---

## 4. UI/UX Design Tokens & Components

### 4.1. Design Tokens (Odoo 18 Compatible)
| Token | Value | Application |
| :--- | :--- | :--- |
| `--adv-success` | `#28a745` | Successful Scan / Validated Batch |
| `--adv-warning` | `#ffc107` | Partial Fill / Missing Serial |
| `--adv-error` | `#dc3545` | System Error / Access Denied |
| `--adv-primary` | `#71639e` | Primary Action (Confirm/Validate) |
| `--touch-target` | `48px` | Minimum height for mobile buttons |

### 4.2. UI Components
1.  **The "Feedback Toast":** A persistent notification area at the bottom of the barcode interface. It differentiates between `System Errors` (Red) and `Workflow Warnings` (Orange).
2.  **The "Live-Sync" Indicator:** A small pulse icon in the header showing the status of inter-company synchronization.
3.  **Haptic Feedback Bridge:** Javascript hook to trigger device vibration on failed scans (for Android/iOS handhelds).

---

## 5. Error Handling & Optimization Strategy

### 5.1. Robust Error Propagation
*   **Requirement:** No backend error should result in an "Unknown Issue" modal.
*   **Implementation:**
    ```python
    try:
        self._process_tracking_request(data)
    except Exception as e:
        _logger.exception("Tracking API Failure") # Logs stack trace
        raise UserError(_("Communication with Tracking Server failed: %s") % str(e))
    ```

### 5.2. Access Control Verification
*   **Audit Requirement:** Validate that the `stock.picking.batch` extensions are accessible to the `UAT User` role.
*   **Fix:** Explicit entry in `ir.model.access.csv` for `model_adv_inventory_sync_log`.

---

## 6. Testing & Quality Assurance

### 6.1. End-to-End (E2E) Configuration
To prevent timeouts in high-latency UAT environments:
*   **Global Timeout:** Set to `60,000ms`.
*   **Wait Strategy:** `domcontentloaded` (Transitioned away from `networkidle` to ignore Odoo's long-polling bus).
*   **Concurrency:** Max 3 workers to prevent database locking during intensive batch tests.

### 6.2. Acceptance Criteria
*   [ ] **Barcode Response:** Scans must process in < 200ms on a 4G connection.
*   [ ] **Error Clarity:** Triggering a `UserError` in the backend must display the specific error string in the Barcode UI without refreshing the page.
*   [ ] **Access Rights:** A user with only "Inventory / User" rights must be able to complete a full "Receive -> Batch -> Ship" flow without permission errors.
*   [ ] **Logs:** Every failed external API call must generate an `ir.logging` entry with the `type: 'error'` and a full traceback.

---

## 7. Priority Feature Map (Iteration 4)
1.  **P0 (Critical):** Integration of the optimized `try-except` wrappers in the Barcode Controller.
2.  **P0 (Critical):** Update `ir.model.access.csv` for UAT compatibility.
3.  **P1 (High):** Mobile-first CSS overrides for the Batch Picking Kanban.
4.  **P1 (High):** Updated Playwright/Tour test suite with 60s timeouts.
5.  **P2 (Medium):** Haptic feedback JS integration.

## Acceptance Criteria
- All features must be fully implemented (no placeholders)
- UI must be responsive and accessible
- Error handling must be comprehensive
- Code must pass TypeScript compilation

---
*Generated by ASLA Product Agent - Iteration 4 - 2026-01-02T08:23:30.110Z*
