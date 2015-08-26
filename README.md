# chaki
Chaki is a package manager for nodejs that allows users to install Sencha packages hosted on github.

# installation
    npm install -g chaki
or
    git clone git@github.com:JarvusInnovations/chaki.git

# Usage
from Sencha project root:
    chaki install

from anywhere:
    chaki install --app /path/to/your/sencha/app
    
to install a single package and its dependencies (will save packageName to app.json)
    chaki install packageName
