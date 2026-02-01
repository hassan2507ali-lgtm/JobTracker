from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

app = FastAPI()

# Setup izin akses (CORS) agar Next.js bisa mengambil data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Server Python Nyala! 🔥"}

# --- FITUR 1: DATA MARKET REAL-TIME (UPDATE 24 SAHAM) ---
@app.get("/quotes")
def get_market_quotes():
    # DAFTAR 24 SAHAM TOP INDONESIA
    # Kita masukkan berbagai sektor biar dashboard ramai
    watch_list = [
        # Banking (Bank Besar & Digital)
        "BBCA.JK", "BBRI.JK", "BMRI.JK", "BBNI.JK", "BRIS.JK", "ARTO.JK",
        # Telco & Tech
        "TLKM.JK", "ISAT.JK", "EXCL.JK", "GOTO.JK", "BUKA.JK",
        # Mining & Energy (Tambang)
        "ADRO.JK", "PTBA.JK", "PGAS.JK", "ANTM.JK", "INCO.JK", "MDKA.JK", "BUMI.JK",
        # Consumer, Auto & Retail
        "ASII.JK", "UNVR.JK", "ICBP.JK", "INDF.JK", "KLBF.JK", "AMRT.JK"
    ]
    
    raw_data = []
    
    # Scanning data satu per satu
    for t in watch_list:
        try:
            stock = yf.Ticker(t)
            # Menggunakan fast_info agar loading lebih cepat
            price = stock.fast_info.last_price
            prev = stock.fast_info.previous_close
            
            # Hitung persentase naik/turun
            change_pct = ((price - prev) / prev) * 100
            
            # Bersihkan kode (hilangkan .JK)
            clean_code = t.replace(".JK", "")
            
            raw_data.append({
                "code": clean_code,
                "name": clean_code, # Nama disamakan kode biar ringkas
                "price": f"{price:,.0f}".replace(",", "."), # Format Rupiah (misal: 5.200)
                "change_val": change_pct, # Angka asli untuk keperluan sorting
                "change": f"{change_pct:+.2f}%", # Format Persen (misal: +1.25%)
                "up": change_pct >= 0 # True jika hijau, False jika merah
            })
        except:
            continue # Jika ada saham error, skip saja

    # LOGIKA TRENDING:
    # Urutkan berdasarkan 'change_val' (volatilitas), dari yang terbesar (abs).
    # Jadi saham yang naik tinggi ATAU turun dalam akan muncul di paling kiri.
    sorted_data = sorted(raw_data, key=lambda x: abs(x["change_val"]), reverse=True)

    # PENTING: Kembalikan SEMUA data (jangan dipotong [:5])
    return sorted_data

# --- FITUR 2: ANALISA AI SEDERHANA ---
@app.get("/analisa/{ticker}")
def analisa_saham(ticker: str):
    try:
        # Tambahkan .JK otomatis jika user lupa
        if not ticker.endswith(".JK") and not ticker.endswith(".US"): 
             ticker = ticker + ".JK"

        saham = yf.Ticker(ticker)
        info = saham.info
        
        harga = info.get('currentPrice', 0)
        # Simulasi target harga +5% jika data target tidak tersedia
        target = info.get('targetMeanPrice', harga * 1.05) 
        summary = info.get('longBusinessSummary', 'Tidak ada data deskripsi.')
        
        # Logika sederhana rekomendasi
        if harga < target:
            rek = "BUY 🟢"
        else:
            rek = "WAIT 🟡"
            
        return {
            "nama": info.get('longName', ticker),
            "harga": harga,
            "target": target,
            "rekomendasi": rek,
            "summary": summary[:300] + "..." # Potong deskripsi biar tidak kepanjangan
        }
    except Exception as e:
        return {"error": str(e)}