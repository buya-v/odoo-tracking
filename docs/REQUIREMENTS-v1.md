# Odoo tracking - Requirements Document

## Iteration 1

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
Initial iteration - no previous feedback

## Refined Requirements
# Technical Specification: Advanced Inventory & Multi-Company Tracking (Odoo 18)

## 1. Project Overview
**Module Technical Name:** `adv_inventory_pro`  
**Base Dependencies:** `stock`, `barcodes`, `stock_picking_batch`, `resource`  
**Odoo Version:** 18.0 (Enterprise)  
**Objective:** Enhance inventory throughput via high-speed barcode validation, mobile-first batch picking, and seamless inter-company stock synchronization.

---

## 2. UI/UX Design Tokens
To ensure the interface is functional in high-glare warehouse environments on handheld devices (Zebra/Honeywell).

| Token | Value | Application |
| :--- | :--- | :--- |
| **Primary Color** | `#00A09A` (Odoo Teal) | Primary Action Buttons |
| **Success State** | `#28A745` | Valid Scan / Fully Picked |
| **Warning State** | `#FFC107` | Partial Scan / Multi-location |
| **Error State** | `#DC3545` | Wrong Product / Invalid Bin |
| **Font Family** | `Inter`, Sans-serif | High readability |
| **Touch Target** | Min 48px x 48px | All interactive XML elements |
| **Scan Feedback** | Audio + Haptic + Visual | Barcode validation loop |

---

## 3. Component Breakdown & Technical Requirements

### 3.1. Rapid Scan-to-Validate Interface (OWL Component)
**Logic:** A custom OWL (Odoo Web Library) screen that extends the `stock_barcode` client action.
*   **Audio Triggers:** Use `AudioContext` to play distinct "Success" (High-pitch) and "Error" (Low-pitch) tones.
*   **Autosave Logic:** Trigger `action_validate` automatically when `reserved_qty == qty_done` for all lines, reducing clicks.
*   **Persistence:** LocalStorage integration to prevent data loss on Wi-Fi dropouts.

### 3.2. Mobile-Responsive Batch XML Optimization
**Logic:** A specialized inherited view for `stock.picking.batch`.
*   **View ID:** `view_picking_batch_form_mobile_optimized`
*   **Priority:** 100 (Highest)
*   **Attributes:** Hide `user_id`, `company_id`, and `scheduled_date` from the main list. 
*   **Fields Displayed:**
    1. `location_id` (Bin - Bolded, 18px font)
    2. `product_id` (Truncated to 2 lines)
    3. `qty_done` / `product_uom_qty` (Progress bar style)

### 3.3. Inter-Company Transfer (ICT) Engine
**Logic:** Python backend trigger on `stock.picking` state change.
*   **Trigger:** `_action_done()` override.
*   **Workflow:**
    1. Detect if `picking_type_id` is an Outgoing type to a partner linked to a sister Company.
    2. Automatically instantiate `stock.picking` (Incoming) in Company B.
    3. Map `stock.move` lines (Product ID, Qty, Serial/Lot).
    4. Link records via a new field `x_source_picking_id` for traceability.

### 3.4. Global Inventory Pivot View
**Logic:** Custom SQL view or ORM-level aggregation.
*   **Model:** `stock.quant`
*   **Aggregation:** Group by `product_id`, `location_id` (Parent), and `company_id`.
*   **Calculated Fields:** 
    * `Total On Hand`
    * `Available Qty` (On Hand - Reserved)
    * `Value` (Standard Price * On Hand)

---

## 4. Technical Architecture

### 4.1. Data Model Extensions
```python
class StockPicking(models.Model):
    _inherit = 'stock.picking'

    # Tracks the automated receipt in the destination company
    intercompany_transfer_ref = fields.Many2one('stock.picking', string="Linked Receipt")
    is_rapid_scan_completed = fields.Boolean(default=False)

class StockMove(models.Model):
    _inherit = 'stock.move'
    
    # Fast-lookup for bin priority sorting
    bin_sequence = fields.Integer(related='location_id.removal_priority', store=True)
```

### 4.2. Record Rules (Security)
Strict isolation for Multi-Company (David Wu's requirement).

```xml
<record id="rule_stock_picking_multi_company" model="ir.rule">
    <field name="name">Stock Picking: Multi-Company Isolation</field>
    <field name="model_id" ref="stock.model_stock_picking"/>
    <field name="domain_force">[('company_id', 'in', company_ids)]</field>
    <field name="perm_read" eval="True"/>
    <field name="perm_write" eval="True"/>
    <field name="perm_create" eval="True"/>
    <field name="perm_unlink" eval="True"/>
</record>
```

---

## 5. Implementation Roadmap

### Phase 1: Security & Multi-Company (Backend)
*   Implement `ir.rule` for `stock.picking`, `stock.move`, and `stock.quant`.
*   Configure Company A and Company B Warehouse/Location structures.

### Phase 2: Inter-Company Automation (Python)
*   Develop `stock.picking` override logic.
*   Ensure Serial/Lot numbers carry over during the auto-creation of the Receipt in Company B.

### Phase 3: Mobile UX & Rapid Scan (OWL/XML)
*   Create the simplified Batch View (`stock_picking_batch`).
*   Inject CSS for "High Contrast Mode" on handheld devices.
*   Develop OWL JS class for Barcode audio feedback.

### Phase 4: Analytics (Reporting)
*   Create the Global Pivot View.
*   Add a "Cross-Company Reconcile" dashboard.

---

## 6. Success Metrics
*   **Scan Speed:** Reduce validation time from ~8 seconds (standard) to <2 seconds per item.
*   **Data Integrity:** 0% "limbo" stock between companies (automatic creation of receipts).
*   **User Adoption:** Minimal training required due to the "Bin-First" mobile UI focus.

## Acceptance Criteria
- All features must be fully implemented (no placeholders)
- UI must be responsive and accessible
- Error handling must be comprehensive
- Code must pass TypeScript compilation

---
*Generated by ASLA Product Agent - Iteration 1 - 2026-01-02T06:30:16.560Z*
