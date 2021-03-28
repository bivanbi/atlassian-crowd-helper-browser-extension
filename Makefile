.DEFAULT_GOAL := all

APP_NAME = crowd_helper
CHROME = google-chrome

SRC = src
DOWNLOAD = download
TARGET = target
PACKAGES = packages

CHROME_APP_VERSION = $(shell cat $(SRC)/$(CHROME)/manifest.json | grep version | head -1 | cut -d\" -f 4 )

JQUERY_URL="https://code.jquery.com/jquery-3.5.1.slim.min.js"
JQUERY_LICENSE_URL="https://jquery.org/license/"

BOOTSTRAP_ZIP_URL="https://github.com/twbs/bootstrap/releases/download/v4.6.0/bootstrap-4.6.0-dist.zip"
BOOTSTRAP_LICENSE_URL="https://raw.githubusercontent.com/twbs/bootstrap/v4.0.0/LICENSE"
BOOTSTRAP_ZIP = $(DOWNLOAD)/bootstrap.zip

CLIPART_REPO_URL="https://github.com/bivanbi/atlassian-tools-clipart.git"
CLIPART_REPO = $(DOWNLOAD)/clipart

JQUERY_URL="https://code.jquery.com/jquery-3.5.1.slim.min.js"

VENDOR_DIR = vendor
JQUERY_DIR = $(VENDOR_DIR)/jquery
JQUERY_JS = jquery.slim.min.js

BOOTSTRAP_DIR = $(VENDOR_DIR)/bootstrap
BOOTSTRAP_CSS = bootstrap.min.css
BOOTSTRAP_JS = bootstrap.bundle.min.js

IMAGE_DIR = images
FAVICON = favicon.ico

all: $(CHROME)


.PHONY: $(CHROME)
$(CHROME): $(TARGET)/$(CHROME) \
			$(TARGET)/$(CHROME)/$(JQUERY_DIR)/LICENSE \
			$(TARGET)/$(CHROME)/$(JQUERY_DIR)/$(JQUERY_JS) \
			$(TARGET)/$(CHROME)/$(BOOTSTRAP_DIR)/LICENSE \
			$(TARGET)/$(CHROME)/$(BOOTSTRAP_DIR)/$(BOOTSTRAP_CSS) \
			$(TARGET)/$(CHROME)/$(BOOTSTRAP_DIR)/$(BOOTSTRAP_JS) \
			$(TARGET)/$(CHROME)/$(IMAGE_DIR) \
			$(PACKAGES)/$(APP_NAME)-$(CHROME)-v$(CHROME_APP_VERSION).zip

$(BOOTSTRAP_ZIP):
	mkdir -p $(DOWNLOAD)
	curl -sfL "$(BOOTSTRAP_ZIP_URL)" -o $(BOOTSTRAP_ZIP)

$(CLIPART_REPO):
	mkdir -p $(DOWNLOAD)
	git clone "$(CLIPART_REPO_URL)" $(CLIPART_REPO)

$(TARGET)/$(CHROME):
	mkdir -p $(TARGET)/$(CHROME)
	(cd $(SRC)/$(CHROME) ; tar cf - --exclude="images" --exclude="vendor" --exclude=".gitignore" . ) | (cd $(TARGET)/$(CHROME) ; tar xfBp -)

%/$(JQUERY_JS):
	mkdir -p "$$(dirname $@)"
	curl -sf "$(JQUERY_URL)" -o $@

%/$(BOOTSTRAP_CSS): $(BOOTSTRAP_ZIP)
	unzip -u $(BOOTSTRAP_ZIP) -d $(DOWNLOAD)/
	mkdir -p "$$(dirname $@)"
	cp $(DOWNLOAD)/bootstrap*dist/css/bootstrap.min.css "$@"

%/$(BOOTSTRAP_JS): $(BOOTSTRAP_ZIP)
	unzip -u $(BOOTSTRAP_ZIP) -d $(DOWNLOAD)/
	mkdir -p "$$(dirname $@)"
	cp $(DOWNLOAD)/bootstrap*dist/js/bootstrap.bundle.min.js "$@"

%/$(BOOTSTRAP_DIR)/LICENSE:
	mkdir -p "$$(dirname $@)"
	curl -sf "$(BOOTSTRAP_LICENSE_URL)" -o $@

%/$(JQUERY_DIR)/LICENSE:
	mkdir -p "$$(dirname $@)"
	echo "JQuery is licensed under MIT license. See $(JQUERY_LICENSE_URL) for details." > $@

$(TARGET)/$(CHROME)/$(IMAGE_DIR): $(CLIPART_REPO)
	$(DOWNLOAD)/clipart/make_icons.sh
	mkdir -p $(TARGET)/$(CHROME)/$(IMAGE_DIR)
	cp --no-preserve timestamps $(DOWNLOAD)/clipart/src/$(APP_NAME).svg $(TARGET)/$(CHROME)/$(IMAGE_DIR)
	cp --no-preserve timestamps $(DOWNLOAD)/clipart/target/$(APP_NAME)/*png $(TARGET)/$(CHROME)/$(IMAGE_DIR)/

$(PACKAGES)/$(APP_NAME)-$(CHROME)-%.zip:
	mkdir -p $(PACKAGES)
	zip -r $@ $(TARGET)/$(CHROME)

clean:
	rm -rf $(TARGET) $(DOWNLOAD)
