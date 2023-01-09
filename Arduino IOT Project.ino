#include <SPI.h>
#include <MFRC522.h>
#include "Arduino.h"


// definisco i pin per i vari sensori e attuatori

#define triggerPort 6  // sensore di prossimità
#define echoPort 7     // sensore di prossimità
#define SS_PIN 10   //nfc
#define RST_PIN 9     //nfc
#define LED_G 5 //pin LED verde
#define LED_R 4  //pin LED rosso
#define RELAY 3 //relay pin
#define ACCESS_DELAY 2000
#define DENIED_DELAY 1000
MFRC522 mfrc522(SS_PIN, RST_PIN);   // crea un istanza del sensore MFRC522 nfc .





 
void setup() 
{
  Serial.begin(9600);   // Inizializzo la porta seriale
  SPI.begin();          // Inizializzo SPI
  mfrc522.PCD_Init();   // Inizializzo MFRC522 nfc
  pinMode(triggerPort, OUTPUT);
  pinMode(echoPort, INPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_R, OUTPUT);
  pinMode(RELAY, OUTPUT);
  digitalWrite(RELAY, HIGH);
  

  //Serial.println("Avvicina la carta per sbloccare la serratura...");
  Serial.println();


}
void check_forced_entry(){ // funzione che controlla periodicamente se c'è una effrazione attraverso il sensore di prossimità

  digitalWrite( triggerPort, LOW ); //porta bassa l'uscita Trig = reset porta
  delay(2);
 
  digitalWrite( triggerPort, HIGH ); //invia un impulso di 10microsec su Trig
  delayMicroseconds( 10 );
  digitalWrite( triggerPort, LOW );
 
  long durata = pulseIn( echoPort, HIGH ); //misura la durata dell'impulso ALTO su Echo
 
  Serial.print("distanza: ");
  Serial.write(0xfd); //inizio pacchetto stato effrazione
  if ( durata > 38000 ) //dopo 38ms è fuori dalla portata del sensore
  {
    Serial.print("!OK");
    digitalWrite(LED_R, HIGH);
  }
  else { 
 
 long distanza = 0.0343 * durata / 2; //calcolo distanza

   if(distanza > 5){ // se la porta risulta aperta
      
      Serial.print("!OK"); // invio nella seriale il pacchetto ALLARME
      digitalWrite(LED_R, HIGH);
      
      
   }else{
      
      Serial.print("OK"); // altrimento tutto ok
      digitalWrite(LED_R, LOW);
   }
 
  }
  Serial.write(0xfc);  //fine pacchetto stato stato effrazione
  delay(2000); //Attesa in ms prima della prossima misura
  digitalWrite(LED_R, LOW);
}




int check_proximity(){ // funzione per controllare lo status della porta, se aperta o chiusa

  digitalWrite( triggerPort, LOW ); //porta bassa l'uscita Trig = reset porta
  delay(2);
 
  digitalWrite( triggerPort, HIGH ); //invia un impulso di 10microsec su Trig
  delayMicroseconds( 10 );
  digitalWrite( triggerPort, LOW );
 
  long durata = pulseIn( echoPort, HIGH ); //misura la durata dell'impulso ALTO su Echo
 
  if ( durata > 38000 ) //dopo 38ms è fuori dalla portata del sensore
  {
   return 1;  // PORTA APERTA
  }
  else { //se riceve un'onda riflessa da un ostacolo stampa distanza a video
 
 long distanza = 0.0343 * durata / 2; //calcolo distanza

   if(distanza > 5){
      
      return 1;   // PORTA APERTA
   }else{
      
      return 0;    // PORTA CHIUSA
   }
 
  }
  
  delay(2000); //Attesa in ms prima della prossima misura
}





void check_card(){ // funzione che controlla se viene inserita una card nfc 
// Funzione per nuove card
  if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return;
  }
  // lettura card
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }
  //mostra uid card
  Serial.print("UID card :");
  String content= "";
  byte letter;
  
  for (byte i = 0; i < mfrc522.uid.size; i++) 
  {
     Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
     Serial.print(mfrc522.uid.uidByte[i], HEX);
     content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
     content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }

  
  Serial.println();
  Serial.print("Messaggio : ");
  content.toUpperCase();

  if (content.substring(1) == "D4 60 83 2A") //se l'UID della card inserita è corretto, con degli or possono essere definite più card
  {
    Serial.println("Accesso autorizzato");
    Serial.println();
    Serial.write(0x7d); // inizio pacchetto
    Serial.print("O"); // porta aperta
    Serial.write(0x7e);
    delay(500);
    digitalWrite(RELAY, LOW);
    digitalWrite(LED_G, HIGH);
    
    if(check_proximity()){
        Serial.write(0xfb); // inizio pacchetto
        Serial.print("001"); // porta aperta
        Serial.write(0xfa); // fine pacchetto
       // devo comunicare al bridge che la porta è aperta
        while (check_proximity()) // finchè la porta resta aperta 
       {
           delay(10); // controllo ogni 10 secondi
       }
    }
        
    delay(ACCESS_DELAY);
    digitalWrite(RELAY, HIGH);  // CHIUDO LA SERRATURA PERCHE LA PORTA è CHIUSA
    digitalWrite(LED_G, LOW); 
    delay(ACCESS_DELAY);
    Serial.write(0xfb); // inizio pacchetto
    Serial.print("000"); // porta chiusa
    Serial.write(0xfa); // fine pacchetto
    // COMUNICO DI NUOVO AL BRIDGE CHE LA PORTA è CHIUSA
  }
 
 else   {
    Serial.println("Accesso negato");
    digitalWrite(LED_R, HIGH);
    delay(DENIED_DELAY);
    digitalWrite(LED_R, LOW);
  }
  
}


void check_for_remote_input(){ // funzione che riceve l'input di apertura da remoto 
  
    if (Serial.available()>0){
      String a = Serial.readString(); // ricevo il pacchetto dal bridge
        Serial.print("Valore ricevuto: ");
        Serial.println(a);
        int b =a.toInt();
      if(b == 1){ // apri serratura
        digitalWrite(RELAY, LOW);
        digitalWrite(LED_G, HIGH);
        digitalWrite(LED_R, LOW);
        delay(10); // aspetto per vedere se la porta viene chiusa
        if(check_proximity()){  // se la porta è aperta
        Serial.write(0xfb); // inizio pacchetto
        Serial.print("001"); // porta aperta
        Serial.write(0xfa); // fine pacchetto
       // devo comunicare al bridge che la porta è aperta
        while (check_proximity()) // finchè la porta resta aperta
       {
           delay(10); // controllo ogni 10 secondi
       }
    }  
     // richiudo la porta..
    delay(ACCESS_DELAY);
    digitalWrite(RELAY, HIGH);  // CHIUDO LA SERRATURA PERCHE LA PORTA è CHIUSA
    digitalWrite(LED_G, LOW); 
    delay(ACCESS_DELAY);
    Serial.write(0xfb); // inizio pacchetto
    Serial.print("000"); // porta chiusa
    Serial.write(0xfa); // fine pacchetto
      }else if (b == 0){
        digitalWrite(RELAY, HIGH);
        digitalWrite(LED_G, LOW);
      }
    }

    
  

}

void loop() 
{
  check_for_remote_input();
  
  check_card();

  check_forced_entry();

  

}
