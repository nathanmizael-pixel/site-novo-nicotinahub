with open('src/pages/Profile.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the exact old section
old = '''            ) : (
              <Stack gap="md" className="space-y-4">
                  {(posts.map((post, index) => {
                    const delay = index * 80;
                    return (
                      <div
                        key={post.id}
                        className="animate-reveal-up"
                        style={{ '--animation-delay': delay + 'ms' } as React.CSSProperties }
                      >
                        <div className="p-4 bg-surface/50 backdrop-blur-sm border border-border rounded-xl">
                          <p className="text-text">{post.content}</p>
                        </div>
                      </div>
                    );
                  )}
                )
              </Stack>
              )
            </Container>'''

new = '''            ) : (
              <Stack gap="md" className="space-y-4">
                {(posts.map((post, index) => {
                    const delay = index * 80;
                    return (
                      <div
                        key={post.id}
                        className="animate-reveal-up"
                        style={{ '--animation-delay': delay + 'ms' } as React.CSSProperties }
                      >
                        <div className="p-4 bg-surface/50 backdrop-blur-sm border border-border rounded-xl">
                          <p className="text-text">{post.content}</p>
                        </div>
                      </div>
                    );
                  )}
                )
              </Stack>
              )
            </Container>'''

with open('src/pages/Profile.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

if old in content:
    content = content.replace(old, new)
    with open('src/pages/Profile.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Fixed!')
else:
    print('Old section not found')
    # Debug
    idx = content.find('posts.length === 0')
    print(repr(content[idx:idx+500]))