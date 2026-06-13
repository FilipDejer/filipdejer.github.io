import sys

name = "Filip"
album = "57727"
version = sys.version.split()[0]
path = sys.executable

print(f"Hello {name} ({album}).")
print(f"This environment is using Python version {version}")
print(f"at location {path}.")