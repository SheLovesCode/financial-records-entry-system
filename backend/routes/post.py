from flask import Blueprint, jsonify, request
from models.transaction_model import Transaction
from db.db_service import db
from datetime import datetime
from schemas.transaction_schema import TransactionInput
from schemas.transaction_schema import TransactionOutput

from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError

blp = Blueprint('TransactionPostRequests',__name__)

@blp.post("/transactions")
def new_transaction_record():
    try:
        data = TransactionInput(**request.get_json())

    except ValidationError as e:
        return jsonify({"error": str(e)}), 400

    try:
        new_transaction = Transaction(
            amount=data.amount,
            type=data.type,
            description=data.description,
            date=datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        )
        db.session.add(new_transaction)
        db.session.commit()

        return jsonify(TransactionOutput(
            id=new_transaction.id,
            amount=new_transaction.amount,
            date=new_transaction.date,
            type=new_transaction.type,
            description=new_transaction.description).dict()), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500