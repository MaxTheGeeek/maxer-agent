import glob

import_block = """import React from 'react';
import { ICX } from './icons';
import { useApp, LiveBrain, MatchMeter, StackBadge, DistancePill, Tooltip, SeverityDot, Card, CardHead, TBtn } from './shell';
"""

views = glob.glob('frontend/src/view-*.jsx')
for view in views:
    with open(view, 'r') as f:
        content = f.read()
    
    # Remove existing basic react import if present
    content = content.replace("import React from 'react';\n", "")
    content = content.replace('import React from "react";\n', "")
    
    new_content = import_block + content
    
    with open(view, 'w') as f:
        f.write(new_content)
