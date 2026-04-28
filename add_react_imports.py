import os
import glob

src_dir = 'frontend/src'
jsx_files = glob.glob(os.path.join(src_dir, '*.jsx'))

for file in jsx_files:
    with open(file, 'r') as f:
        content = f.read()
    
    if "import React" not in content:
        with open(file, 'w') as f:
            f.write("import React from 'react';\n" + content)
