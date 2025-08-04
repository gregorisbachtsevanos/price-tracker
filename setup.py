from setuptools import setup, find_packages

setup(
    name='price_tracker',
    version='1.0.0',
    packages=find_packages(),
    install_requires=[
        'requests',
        'python-dotenv',
        'schedule',
        'yfinance',
    ],
    entry_points={
        'console_scripts': [
            'price-tracker=price_tracker.cli:main'
        ],
    },
)
