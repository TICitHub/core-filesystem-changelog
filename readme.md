# Filesystem Changelog Adapter
Filesystem Changelog Adapter for @navarik/storage

## Installation
```
npm install refdata-storage-filesystem-changelog --save
```

## Usage example
```javascript
import ChangelogAdapter from 'refdata-storage-filesystem-changelog'
import createStorage from 'refdata-storage'

const log = new ChangelogAdapter({
  workingDirectory: '/var/storage',
  format: 'json'
})

const storage = createStorage({ log })
```
