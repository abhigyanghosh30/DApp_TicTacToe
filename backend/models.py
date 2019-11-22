from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
app.secret_key = os.urandom(67)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ganes.db'
db = SQLAlchemy(app)

class Player(db.Model):
    __tablename__ = 'players'
    
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	address = db.Column(db.String(100), nullable=False)
    game_contract = db.Column(db.String(100), nullable=False)