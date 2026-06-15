tools = [
    {
        "name": "add_gold_item",
        "description": "Add a new gold item to inventory",
        "input_schema": {
            "type": "object",
            "properties": {
                "item_type_id": {
                    "type": "integer",
                    "description": "ID of the item type (ring, necklace etc)",
                },
                "weight_tola": {"type": "number", "description": "Weight in tola"},
                "karat": {
                    "type": "integer",
                    "enum": [18, 22, 24],
                    "description": "Karat purity of gold",
                },
                "purchase_price": {
                    "type": "number",
                    "description": "Purchase price in NPR",
                },
            },
            "required": ["item_type_id", "weight_tola", "karat", "purchase_price"],
        },
    },
    {
        "name": "sell_item",
        "description": "Mark a gold or silver item as sold",
        "input_schema": {
            "type": "object",
            "properties": {
                "item_id": {"type": "integer", "description": "ID of the item"},
                "metal": {"type": "string", "enum": ["gold", "silver"]},
                "selling_price": {
                    "type": "number",
                    "description": "Selling price in NPR",
                },
            },
            "required": ["item_id", "metal", "selling_price"],
        },
    },
    {
        "name": "set_daily_price",
        "description": "Set today's gold and silver price",
        "input_schema": {
            "type": "object",
            "properties": {
                "gold_price_per_tola": {"type": "number"},
                "silver_price_per_tola": {"type": "number"},
            },
            "required": ["gold_price_per_tola", "silver_price_per_tola"],
        },
    },
    {
        "name": "get_inventory_summary",
        "description": "Get current inventory summary including total items and value",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_profit_report",
        "description": "Get profit report for current month",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_all_item_types",
        "description": "Get all available item types like ring, necklace etc",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "add_silver_item",
        "description": "Add a new silver item to inventory",
        "input_schema": {
            "type": "object",
            "properties": {
                "item_type_id": {"type": "integer"},
                "weight_tola": {"type": "number"},
                "purity_percent": {
                    "type": "number",
                    "description": "Purity percentage e.g 92.5",
                },
                "purchase_price": {"type": "number"},
            },
            "required": [
                "item_type_id",
                "weight_tola",
                "purity_percent",
                "purchase_price",
            ],
        },
    },
]
