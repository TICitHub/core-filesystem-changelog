# Filesystem Changelog Adapter
Filesystem Changelog Adapter for @navarik/storage

## Installation
```
npm install refdata-storage-filesystem-changelog --save
```

## Usage example
```javascript
import { FilesystemChangelog } from '@navarik/storage-filesystem-changelog'
import { Storage } from '@navarikstorage'

const changelog = new FilesystemChangelog({
  workingDirectory: '/var/storage',
  format: 'json'
})

const storage = new Storage({ changelog })
```
