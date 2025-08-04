from setuptools import setup, find_packages

setup(
    name='price_tracker',
    version='0.1',
    package_dir={"": "src"},
    packages=find_packages(where="src"),
    entry_points={
        'console_scripts': [
            'price-tracker=price_tracker.cli:main',
        ],
    },
    install_requires=[
        'click',
        'schedule',
        'requests',
        'textual',
        'rich',
        'python-dotenv',
    ],
)
