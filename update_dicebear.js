const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/game_data.json', 'utf8'));

const getDiceBearUrl = (entity) => {
  const seed = entity.id.replace(/_/g, '');
  
  if (entity.type === 'portal') {
    return `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}`;
  }
  
  if (entity.name.includes("General") || entity.name.includes("King") || entity.name.includes("Chef")) {
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`; 
  }
  
  if (entity.name.includes("Sir Nibbles")) {
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
  }
  
  if (entity.type === 'item') {
    return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}`;
  }
  
  return `https://api.dicebear.com/9.x/bottts/svg?seed=${seed}`;
}

for (const sceneKey in data.scenes) {
  const scene = data.scenes[sceneKey];
  if (scene.entities) {
    scene.entities.forEach(ent => {
      ent.image = getDiceBearUrl(ent);
    });
  }
}

fs.writeFileSync('data/game_data.json', JSON.stringify(data, null, 2));
console.log("Updated data/game_data.json to use DiceBear.");
