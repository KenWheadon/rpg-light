# LLM Guide: Generating Data for the HTML/JS 2D Story Engine

This document provides instructions for a Large Language Model (LLM) to generate a valid `game_data.json` file for our Vanilla HTML5 2D Story Engine.

## System Overview

The engine uses a Data-Driven, Event-Based Architecture. All game content—scenes, layout, items, interactive entities, portals, logic, and dialogues—is defined in a single JSON object. The frontend engine merely parses this JSON to render the game state and handle interactions.

## JSON Schema Structure

The `game_data.json` file must contain a single JSON object with the following root keys:

- `settings`: Global configuration.
- `state`: Initial player state (inventory and boolean flags).
- `scenes`: A dictionary of all locations/rooms in the game.
- `dialogues`: A dictionary of all conversation trees and inspection texts.

---

### 1. `settings`

Defines the starting parameters for the game.

```json
"settings": {
  "start_scene": "tavern_main",
  "player_name": "Hero"
}
```

### 2. `state`

Defines the initial inventory and global flags.

```json
"state": {
  "inventory": [],
  "flags": {
    "has_met_king": false,
    "cellar_unlocked": false
  }
}
```

### 3. `scenes`

A dictionary where each key is a unique scene ID (e.g., `"tavern_main"`).
Each scene must have:

- `background`: String URL to a background image.
- `entities`: Array of interactive objects in the scene.

#### Entities

An entity represents anything the player can click on: items to pick up, doors to enter, NPCs to talk to, or decor to inspect.

- `id`: Unique string identifier for the entity (e.g., `"rusty_key_01"`).
- `name`: Human-readable name (e.g., `"Rusty Key"`).
- `type`: Must be `"item"`, `"portal"`, or `"decor"`.
- `x`: Float representing percentage from the left (0-100).
- `y`: Float representing percentage from the top (0-100).
- `image`: String URL to the entity's sprite/image.
- `on_click`: Array of interaction event blocks.

#### Interactions (`on_click`)

When a player clicks an entity, the engine evaluates the `on_click` array top-to-bottom. It executes the `actions` of the _first_ block where all `conditions` are met.

**Conditions:**

- `{ "type": "requires_active_item", "value": "item_id" }`: Checks if the player is holding/has selected a specific item.
- `{ "type": "has_item", "value": "item_id" }`: Checks if the item is in the inventory.
- `{ "type": "flag_true", "value": "flag_name" }`: Checks if a specific state flag is true.
- _Default/Fallback_: An empty array `[]` or `[{ "conditions": [ "default" ] }]` acts as a fallback if previous conditionals fail.

**Actions:**

- `{ "type": "add_item", "target": "item_id" }`: Adds an item to the inventory.
- `{ "type": "remove_entity" }`: Removes the clicked entity from the scene.
- `{ "type": "show_message", "value": "Text here" }`: Shows a quick toast/message.
- `{ "type": "set_flag", "target": "flag_name", "value": true/false }`: Changes a global state flag.
- `{ "type": "change_scene", "target": "scene_id" }`: Teleports the player to another scene.
- `{ "type": "show_dialogue", "target": "dialogue_id" }`: Opens a branching dialogue tree.
- `{ "type": "close_dialogue" }`: Closes the current dialogue interface.

### 4. `dialogues`

A dictionary where each key is a unique dialogue ID (e.g., `"door_locked_text"`).
Each dialogue object has:

- `text`: The main prompt/description displayed to the player.
- `choices`: Array of player responses/actions.

#### Choices

Each choice object has:

- `label`: The text on the button.
- `conditions`: (Optional) Array of conditions that must be met for this choice to appear (same format as entity conditions).
- `actions`: Array of actions executed when clicked (same format as entity actions).

---

## Best Practices for the LLM

1. **Consistency:** Ensure that `target` properties in actions perfectly match existing scene IDs, entity IDs, flag names, or dialogue IDs.
2. **Coordinate Percentages:** Use percentage values for `x` and `y` (e.g., `45.5`) so the game scales responsively. `x: 0, y: 0` is top-left.
3. **Placeholder Images:** Use `https://picsum.photos/id/{id}/{width}/{height}` for placeholder backgrounds and entity sprites if no custom assets are provided.
4. **Fallback Logic:** Always provide a fallback `on_click` block with empty conditions `[]` if you have preceding blocks with specific conditions (e.g., a locked door needs a rusty key block AND a generic "it's locked" block below it).
5. **Types:** Restrict entity `type` to `"item"`, `"portal"`, or `"decor"`.
