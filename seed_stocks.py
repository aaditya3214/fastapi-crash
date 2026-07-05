from database import SessionLocal
from models import Stock

nifty50_stocks = [
    {"name": "Adani Enterprises", "symbol": "ADANIENT", "status": "active"},
    {"name": "Adani Ports and SEZ", "symbol": "ADANIPORTS", "status": "active"},
    {"name": "Apollo Hospitals", "symbol": "APOLLOHOSP", "status": "active"},
    {"name": "Asian Paints", "symbol": "ASIANPAINT", "status": "active"},
    {"name": "Axis Bank", "symbol": "AXISBANK", "status": "active"},
    {"name": "Bajaj Auto", "symbol": "BAJAJ-AUTO", "status": "active"},
    {"name": "Bajaj Finance", "symbol": "BAJFINANCE", "status": "active"},
    {"name": "Bajaj Finserv", "symbol": "BAJAJFINSV", "status": "active"},
    {"name": "Bharat Electronics", "symbol": "BEL", "status": "active"},
    {"name": "Bharat Petroleum Corporation", "symbol": "BPCL", "status": "active"},
    {"name": "Bharti Airtel", "symbol": "BHARTIARTL", "status": "active"},
    {"name": "Britannia Industries", "symbol": "BRITANNIA", "status": "active"},
    {"name": "Cipla", "symbol": "CIPLA", "status": "active"},
    {"name": "Coal India", "symbol": "COALINDIA", "status": "active"},
    {"name": "Dr. Reddy's Laboratories", "symbol": "DRREDDY", "status": "active"},
    {"name": "Eicher Motors", "symbol": "EICHERMOT", "status": "active"},
    {"name": "Grasim Industries", "symbol": "GRASIM", "status": "active"},
    {"name": "HCL Technologies", "symbol": "HCLTECH", "status": "active"},
    {"name": "HDFC Bank", "symbol": "HDFCBANK", "status": "active"},
    {"name": "HDFC Life Insurance", "symbol": "HDFCLIFE", "status": "active"},
    {"name": "Hero MotoCorp", "symbol": "HEROMOTOCO", "status": "active"},
    {"name": "Hindalco Industries", "symbol": "HINDALCO", "status": "active"},
    {"name": "Hindustan Unilever", "symbol": "HINDUNILVR", "status": "active"},
    {"name": "ICICI Bank", "symbol": "ICICIBANK", "status": "active"},
    {"name": "IndusInd Bank", "symbol": "INDUSINDBK", "status": "active"},
    {"name": "Infosys", "symbol": "INFY", "status": "active"},
    {"name": "ITC", "symbol": "ITC", "status": "active"},
    {"name": "JSW Steel", "symbol": "JSWSTEEL", "status": "active"},
    {"name": "Kotak Mahindra Bank", "symbol": "KOTAKBANK", "status": "active"},
    {"name": "Larsen & Toubro", "symbol": "LT", "status": "active"},
    {"name": "LTIMindtree", "symbol": "LTIM", "status": "active"},
    {"name": "Mahindra & Mahindra", "symbol": "M&M", "status": "active"},
    {"name": "Maruti Suzuki", "symbol": "MARUTI", "status": "active"},
    {"name": "Nestle India", "symbol": "NESTLEIND", "status": "active"},
    {"name": "NTPC", "symbol": "NTPC", "status": "active"},
    {"name": "Oil & Natural Gas Corporation", "symbol": "ONGC", "status": "active"},
    {"name": "Power Grid Corporation", "symbol": "POWERGRID", "status": "active"},
    {"name": "Reliance Industries", "symbol": "RELIANCE", "status": "active"},
    {"name": "SBI Life Insurance", "symbol": "SBILIFE", "status": "active"},
    {"name": "Shriram Finance", "symbol": "SHRIRAMFIN", "status": "active"},
    {"name": "State Bank of India", "symbol": "SBIN", "status": "active"},
    {"name": "Sun Pharmaceutical", "symbol": "SUNPHARMA", "status": "active"},
    {"name": "Tata Consultancy Services", "symbol": "TCS", "status": "active"},
    {"name": "Tata Consumer Products", "symbol": "TATACONSUM", "status": "active"},
    {"name": "Tata Motors", "symbol": "TATAMOTORS", "status": "active"},
    {"name": "Tata Steel", "symbol": "TATASTEEL", "status": "active"},
    {"name": "Tech Mahindra", "symbol": "TECHM", "status": "active"},
    {"name": "Titan Company", "symbol": "TITAN", "status": "active"},
    {"name": "Trent", "symbol": "TRENT", "status": "active"},
    {"name": "Wipro", "symbol": "WIPRO", "status": "active"},
]

def seed():
    db = SessionLocal()
    inserted = 0
    skipped = 0
    try:
        for stock_data in nifty50_stocks:
            # Check if symbol already exists to avoid duplicates
            existing = db.query(Stock).filter(Stock.symbol == stock_data["symbol"]).first()
            if existing:
                print(f"  SKIP (already exists): {stock_data['symbol']}")
                skipped += 1
                continue
            stock = Stock(
                name=stock_data["name"],
                symbol=stock_data["symbol"],
                status=stock_data["status"],
            )
            db.add(stock)
            inserted += 1
            print(f"  ADDED: {stock_data['symbol']} — {stock_data['name']}")

        db.commit()
        print(f"\n✅ Done! Inserted: {inserted} | Skipped (duplicates): {skipped}")
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
