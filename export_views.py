import glob

views = glob.glob('frontend/src/view-*.jsx')
for view in views:
    with open(view, 'r') as f:
        content = f.read()
    
    # Simple replacement for function exports
    content = content.replace('\nfunction ', '\nexport function ')
    
    # Remove window assignments
    lines = content.split('\n')
    filtered = [l for l in lines if not l.strip().startswith('window.')]
    
    with open(view, 'w') as f:
        f.write('\n'.join(filtered))

